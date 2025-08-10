import os, json, time, queue, threading, datetime as dt, random
from typing import List, Dict, Any
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

load_dotenv()
SHEET_ID = os.environ["SHEET_ID"]
GOOGLE_SA_JSON = json.loads(os.environ["GOOGLE_SA_JSON"])
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

creds = service_account.Credentials.from_service_account_info(GOOGLE_SA_JSON, scopes=SCOPES)
svc = build("sheets", "v4", credentials=creds).spreadsheets()

def _values_get(a1: str):
    return svc.values().get(spreadsheetId=SHEET_ID, range=a1).execute().get("values", [])

def _values_update(a1: str, rows):
    svc.values().update(
        spreadsheetId=SHEET_ID, range=a1,
        valueInputOption="USER_ENTERED", body={"values": rows}
    ).execute()

def _values_append(a1: str, rows):
    svc.values().append(
        spreadsheetId=SHEET_ID, range=a1,
        valueInputOption="USER_ENTERED", body={"values": rows}
    ).execute()

def _clear(a1: str):
    svc.values().clear(spreadsheetId=SHEET_ID, range=a1, body={}).execute()

# A1列名ユーティリティ（Z越え対応）
def _col_letter(n: int) -> str:
    # 1 -> A, 2 -> B ... 26 -> Z, 27 -> AA ...
    s = ""
    while n > 0:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s

# -------------- キュー＆バッチ書き込み --------------
_write_q: "queue.Queue[tuple[str, list]]" = queue.Queue()

def _writer():
    while True:
        try:
            first = _write_q.get()
            bucket: Dict[str, list] = {}
            t0 = time.time()
            items = [first]
            # 1秒ためてまとめて書く
            while time.time() - t0 < 1.0:
                try:
                    items.append(_write_q.get_nowait())
                except queue.Empty:
                    time.sleep(0.05)
            for rng, row in items:
                bucket.setdefault(rng, []).append(row)
            # まとめ書き（指数バックオフ）
            for rng, rows in bucket.items():
                backoff = 0.25
                for _ in range(6):
                    try:
                        _values_append(rng, rows)
                        break
                    except Exception:
                        time.sleep(backoff)
                        backoff *= 2
        except Exception:
            time.sleep(0.5)

threading.Thread(target=_writer, daemon=True).start()

# -------------- ストア --------------
class SheetStore:
    """
    structures: A=title, B=tokens_json, C=updated_at, D=example_json （2行目が現行構造）
    submissions:
        1行目: tokens をヘッダに設定（例: | いつ | どこで | だれが | なにをした | user_id | created_at |）
        2行目以降: [各値..., user_id, created_at] を1行でappend（キュー経由）
    generated:
        A=sentence, B=source_values_json, C=like_count, D=created_at （appendはキュー）
    """

    def set_active_structure(self, title: str, tokens: List[str], example: List[str] | None = None):
        # structures に保存（例文は任意）
        example_json = json.dumps(example) if example else ""
        _values_update(
            "structures!A2:D2",
            [[title, json.dumps(tokens), dt.datetime.utcnow().isoformat(), example_json]]
        )

        # submissions を初期化してヘッダ再設定
        _clear("submissions!A:ZZ")
        headers = tokens + ["user_id", "created_at"]
        end_col_letter = _col_letter(len(headers))
        _values_update(f"submissions!A1:{end_col_letter}1", [headers])

        # 例文があれば 2行目に見本として置く
        if example and len(example) == len(tokens):
            row = example + ["(example)", dt.datetime.utcnow().isoformat()]
            _values_update(f"submissions!A2:{end_col_letter}2", [row])

        # generated 初期化
        _clear("generated!A:D")
        _values_update("generated!A1:D1", [["sentence", "source_values_json", "like_count", "created_at"]])

    def _get_active_tokens(self) -> List[str]:
        r = _values_get("structures!B2:B2")
        if not r or not r[0] or not r[0][0]:
            raise ValueError("構造が未設定です。先に /structures を実行してください。")
        return json.loads(r[0][0])

    def add_submission_row(self, values: List[str], user_id: str):
        tokens = self._get_active_tokens()
        if len(values) != len(tokens):
            raise ValueError(f"valuesの長さ({len(values)})が構造({len(tokens)})と一致していません。")
        row = values + [user_id, dt.datetime.utcnow().isoformat()]
        end_col_letter = _col_letter(len(tokens) + 2)  # user_id, created_at を含む
        _write_q.put((f"submissions!A:{end_col_letter}", row))

    def make_random_sentence_from_columns(self) -> Dict[str, Any]:
        tokens = self._get_active_tokens()
        # 投稿（2行目以降）を取得
        rows = _values_get("submissions!A2:ZZ")
        if not rows:
            raise ValueError("投稿がまだありません。/submissions で追加してください。")

        # 列ごとに候補を集める（空文字を除く）
        col_cands: List[List[str]] = [[] for _ in tokens]
        for r in rows:
            for i in range(len(tokens)):
                if i < len(r) and r[i] != "":
                    col_cands[i].append(r[i])

        words, used = [], []
        for i in range(len(tokens)):
            if col_cands[i]:
                v = random.choice(col_cands[i])
                words.append(v)
                used.append(v)
            else:
                words.append("___")

        sentence = " ".join(words)
        _write_q.put(("generated!A:D", [sentence, json.dumps(used), 0, dt.datetime.utcnow().isoformat()]))
        return {"sentence": sentence}
