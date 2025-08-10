# backend/sheet_store.py
import os, json, time, queue, threading, datetime as dt, random, uuid
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from passlib.hash import bcrypt  # サインアップ用
import re

load_dotenv()
SHEET_ID = os.environ["SHEET_ID"]
GOOGLE_SA_JSON = json.loads(os.environ["GOOGLE_SA_JSON"])
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

creds = service_account.Credentials.from_service_account_info(GOOGLE_SA_JSON, scopes=SCOPES)
svc = build("sheets", "v4", credentials=creds).spreadsheets()

# \uXXXX が含まれていたらだけデコードする（他の文字は触らない）
_uni_pat = re.compile(r"\\u[0-9a-fA-F]{4}")

def _unescape_unicode(s: str) -> str:
    if not isinstance(s, str):
        return s
    if _uni_pat.search(s):
        try:
            return s.encode("utf-8").decode("unicode_escape")
        except Exception:
            return s
    return s

def _values_get(a1: str):
    return svc.values().get(spreadsheetId=SHEET_ID, range=a1).execute().get("values", [])

def _values_update(a1: str, rows):
    svc.values().update(spreadsheetId=SHEET_ID, range=a1,
                        valueInputOption="USER_ENTERED", body={"values": rows}).execute()

def _values_append(a1: str, rows):
    svc.values().append(spreadsheetId=SHEET_ID, range=a1,
                        valueInputOption="USER_ENTERED", body={"values": rows}).execute()

def _clear(a1: str):
    svc.values().clear(spreadsheetId=SHEET_ID, range=a1, body={}).execute()

def _col_letter(n: int) -> str:
    s = ""; 
    while n > 0:
        n, r = divmod(n-1, 26); s = chr(65+r)+s
    return s

# ---- バッチ書き込み（負荷軽減）----
_write_q: "queue.Queue[tuple[str, list]]" = queue.Queue()
def _writer():
    while True:
        try:
            first = _write_q.get()
            bucket: Dict[str, list] = {}
            t0 = time.time(); items = [first]
            while time.time() - t0 < 1.0:
                try: items.append(_write_q.get_nowait())
                except queue.Empty: time.sleep(0.05)
            for rng, row in items:
                bucket.setdefault(rng, []).append(row)
            for rng, rows in bucket.items():
                backoff = 0.25
                for _ in range(6):
                    try: _values_append(rng, rows); break
                    except Exception: time.sleep(backoff); backoff *= 2
        except Exception: time.sleep(0.5)
threading.Thread(target=_writer, daemon=True).start()

# ---- ここからアプリ用ロジック ----
class SheetStore:
    """
    structures: A=title, B=tokens_json, C=updated_at, D=example_json （2行目が現行構造）
    submissions: ユーザー投稿（列= tokens + user_id + created_at）
    generated:   A=id, B=sentence, C=source_values_json, D=created_at
    posted:      A=id, B=when, C=where, D=who, E=what, F=user_id, G=created_at, H=source_sentence_id
    likes:       A=sentence_id, B=user_id, C=created_at
    Users:       A=username, B=password_hash, C=enabled, D=updated_at
    """

    # ---------- 初期化 & 構造 ----------
    def set_active_structure(self, title: str, tokens: List[str], example: Optional[List[str]] = None):
        # structures
        _values_update("structures!A2:D2",
            [[title, json.dumps(tokens), dt.datetime.utcnow().isoformat(), json.dumps(example) if example else ""]])
        # submissions
        _clear("submissions!A:ZZ")
        headers = tokens + ["user_id","created_at"]
        _values_update(f"submissions!A1:{_col_letter(len(headers))}1", [headers])
        if example and len(example) == len(tokens):
            _values_update(f"submissions!A2:{_col_letter(len(headers))}2",
                           [example + ["(example)", dt.datetime.utcnow().isoformat()]])
        # generated（ID付きに統一）
        _clear("generated!A:D")
        _values_update("generated!A1:D1", [["id","sentence","source_values_json","created_at"]])
        # posted
        _values_update("posted!A1:H1",
            [["id","when","where","who","what","user_id","created_at","source_sentence_id"]])
        # likes
        _values_update("likes!A1:C1", [["sentence_id","user_id","created_at"]])
        # Users（ヘッダだけ保証）
        _values_update("Users!A1:D1", [["username","password_hash","enabled","updated_at"]])

    def _get_active_tokens(self) -> List[str]:
        r = _values_get("structures!B2:B2")
        if not r or not r[0] or not r[0][0]:
            raise ValueError("構造が未設定です。先に /structures を実行してください。")
        return json.loads(r[0][0])

    # ---------- 投稿 ----------
    def add_submission_row(self, values: List[str], user_id: str):
        tokens = self._get_active_tokens()
        if len(values) != len(tokens):
            raise ValueError(f"valuesの長さ({len(values)})が構造({len(tokens)})と一致していません。")
        row = values + [user_id, dt.datetime.utcnow().isoformat()]
        _write_q.put((f"submissions!A:{_col_letter(len(tokens)+2)}", row))

    # ---------- ランダム生成（IDを付与、generatedに保存） ----------
    def make_random_sentence_from_columns(self) -> Dict[str, Any]:
        tokens = self._get_active_tokens()
        rows = _values_get("submissions!A2:ZZ")
        if not rows: raise ValueError("投稿がまだありません。/submissions で追加してください。")

        col_cands: List[List[str]] = [[] for _ in tokens]
        for r in rows:
            for i in range(len(tokens)):
                if i < len(r) and r[i] != "":
                    col_cands[i].append(r[i])

        words, used = [], []
        for i in range(len(tokens)):
            v = random.choice(col_cands[i]) if col_cands[i] else "___"
            words.append(v); used.append(v)

        sentence_id = "sen_" + uuid.uuid4().hex[:10]
        sentence = " ".join(words)
        _write_q.put(("generated!A:D", [sentence_id, sentence, json.dumps(used), dt.datetime.utcnow().isoformat()]))
        return {"id": sentence_id, "values": used}

    # ---------- 生成済み一覧 ----------
    def list_generated(self, limit: int = 100, order: str = "desc") -> List[Dict[str, Any]]:
        hdr = _values_get("generated!A1:D1")
        if not hdr or not hdr[0]: return []
        headers = hdr[0]
        rows = _values_get("generated!A2:D") or []
        def pad(r): return r + [""]*(len(headers)-len(r))
        items = [{headers[i]: pad(r)[i] for i in range(len(headers))} for r in rows]
        items.sort(key=lambda x: x.get("created_at",""), reverse=(order.lower()=="desc"))
        return items[:limit]

    # ---------- 「投稿」：生成文を確定保存（列ごと + user） ----------
    def _jp_sentence_to_parts(self, raw: str, expected: int = 4):
        """
        日本語のプレーン文を4列に整形。
        - 全角スペースを半角に
        - 連続スペースを1個に
        - 語が expected 個未満なら空文字でパディング
        - 語が expected 個より多い場合は、最後の列に残りを結合
        """
        if not raw:
            return [""] * expected

        text = str(raw).replace("\u3000", " ").strip()
        tokens = re.split(r"\s+", text) if text else []

        if len(tokens) >= expected:
            head = tokens[:expected-1]
            tail = " ".join(tokens[expected-1:])  # 4列目に残りを集約
            parts = head + [tail]
        else:
            parts = tokens + [""] * (expected - len(tokens))
        return parts
    
    def publish_sentence(self, sentence_id: str, user_id: str) -> dict:
        gen = self._find_generated_by_id(sentence_id)
        if not gen:
            raise ValueError("指定の生成文が見つかりません")

        # ここを差し替え（JSONは使わない）
        raw = gen.get("sentence")
        parts = self._jp_sentence_to_parts(raw, expected=4)

        post_id = "post_" + uuid.uuid4().hex[:10]
        created_at_utc = dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")

        row = [post_id, parts[0], parts[1], parts[2], parts[3], user_id, created_at_utc, sentence_id, raw]
        _write_q.put(("posted!A:I", row))  # ← 2次元配列で渡す

        return {"id": post_id, "sentence_id": sentence_id, "created_at_utc": created_at_utc}

    def _find_generated_by_id(self, sentence_id: str) -> Optional[Dict[str, Any]]:
        hdr = _values_get("generated!A1:D1"); rows = _values_get("generated!A2:D") or []
        if not hdr or not hdr[0]: return None
        headers = hdr[0]
        for r in rows:
            if r and r[0] == sentence_id:
                def pad(x): return x + [""]*(len(headers)-len(x))
                rr = pad(r)
                return {headers[i]: rr[i] for i in range(len(headers))}
        return None

    # ---------- 投稿一覧（最新順） ----------
    def list_posts(self, limit: int = 100, order: str = "desc") -> List[Dict[str, Any]]:
        hdr = _values_get("posted!A1:I1"); rows = _values_get("posted!A2:I") or []
        if not hdr or not hdr[0]: return []
        headers = hdr[0]
        def pad(r): return r + [""]*(len(headers)-len(r))
        items = [{headers[i]: pad(r)[i] for i in range(len(headers))} for r in rows]
        items.sort(key=lambda x: x.get("created_at",""), reverse=True)
        return items[:limit]

    # ---------- いいね（同一ユーザーは1回だけ） ----------
    def like_sentence(self, post_id: str, user_id: str) -> Dict[str, Any]:
        # 既存チェック（O(n)だが件数少ならOK）
        rows = _values_get("likes!A2:C") or []
        for r in rows:
            if len(r) >= 2 and r[0] == post_id and r[1] == user_id:
                return {"ok": True, "duplicated": True}
        _write_q.put(("likes!A:C", [post_id, user_id, dt.datetime.utcnow().isoformat()]))
        return {"ok": True, "duplicated": False}
    
    def weekly_top(self, limit: int = 5) -> list[dict]:
        # 全期間でカウント（時刻パースなし）
        likes = _values_get("likes!A2:C") or []
        counts: dict[str, int] = {}
        for r in likes:
            if len(r) >= 2 and r[0]:
                counts[r[0]] = counts.get(r[0], 0) + 1

        if not counts:
            return []

        # sentence_id -> sentence へ解決
        gen_map: dict[str, str] = {}
        for g in self.list_posts(limit=10_000, order="asc"):
            gen_map[g["id"]] = g.get("sentence", "")

        ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:limit]

        return [
            {"values": gen_map.get(sid, "").split(), "likes": cnt}
            for sid, cnt in ranked
        ]

    # ---------- Users ----------
    def read_users(self) -> list[dict]:
        hdr = _values_get("Users!A1:D1")
        if not hdr or not hdr[0]: return []
        headers = hdr[0]
        rows = _values_get("Users!A2:D") or []
        def pad(r): return r + [""]*(len(headers)-len(r))
        return [{headers[i]: pad(r)[i] for i in range(len(headers))} for r in rows]

    def create_user(self, username: str, password: str):
        existing = _values_get("Users!A2:A") or []
        if any(r and r[0] == username for r in existing):
            raise ValueError("username already exists")
        now = dt.datetime.utcnow().isoformat()
        pw_hash = bcrypt.hash(password)
        _values_append("Users!A:D", [[username, pw_hash, "TRUE", now]])
