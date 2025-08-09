from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import CreateStructureReq, PostSubmissionReq
from sheet_store import SheetStore

app = FastAPI(title="When/Where/Who/What Game API")
store = SheetStore()

# フロントを載せるオリジンに合わせて変更可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"ok": True, "service": "when-where-who-what"}

# 先生：構造＋例文（任意）を設定。既存投稿＆生成はクリア。
@app.post("/structures")
def set_structure(req: CreateStructureReq):
    store.set_active_structure(req.title, req.tokens, req.exampleSentence)
    return {"ok": True}

# 生徒：1投稿＝1行（tokens と同じ数の values を送る）
@app.post("/submissions")
def post_submission(req: PostSubmissionReq):
    try:
        store.add_submission_row(req.values, req.userId or "")
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}

# ランダム生成：各列からランダム抽選→連結。generated にも保存。
@app.get("/random-sentence")
def random_sentence():
    try:
        return store.make_random_sentence_from_columns()
    except ValueError as e:
        raise HTTPException(400, str(e))
