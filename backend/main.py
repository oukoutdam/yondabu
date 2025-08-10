# backend/main.py
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from schemas import CreateStructureReq, PostSubmissionReq, SignUpReq
from sheet_store import SheetStore
from auth_basic import get_current_user

app = FastAPI(title="When/Where/Who/What Game API")
store = SheetStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health(): return {"ok": True}

@app.post("/structures")
def set_structure(req: CreateStructureReq):
    store.set_active_structure(req.title, req.tokens, req.exampleSentence)
    return {"ok": True}

# ① 入力をtokens単位で保存（認証ユーザーを付与）
@app.post("/submissions")
def post_submission(req: PostSubmissionReq):
    try:
        store.add_submission_row(req.values, "user123")
    except ValueError as e:
        raise HTTPException(400, str(e))
    return {"ok": True}

# ② ランダム生成（保存もする）
@app.get("/random-sentence")
def random_sentence():
    try:
        return store.make_random_sentence_from_columns()
    except ValueError as e:
        raise HTTPException(400, str(e))

# ③ 「投稿」ボタン：生成文を posted に列ごと保存（認証必要）
@app.post("/publish/{sentence_id}")
def publish(sentence_id: str):
    try:
        return store.publish_sentence(sentence_id, "user123")
    except ValueError as e:
        raise HTTPException(400, str(e))

# ④ 投稿一覧
@app.get("/posts")
def list_posts(limit: int = Query(100, ge=1, le=1000)):
    return store.list_posts(limit=limit)

# ⑤ いいね（一人一回）
@app.post("/sentences/{post_id}/like")
def like(post_id: str, user=Depends(get_current_user)):
    return store.like_sentence(post_id, user["id"])

# ⑥ 週間ランキング（直近7日）上位5
@app.get("/ranking")
def weekly_top(limit: int = 5):
    return store.weekly_top(limit=limit)

# 参考：生成済み一覧（必要ならUIで使う）
@app.get("/all_sentences")
def all_sentences(limit: int = Query(100, ge=1, le=1000), order: str = Query("desc")):
    order = order.lower(); 
    if order not in ("desc","asc"): order = "desc"
    return store.list_generated(limit=limit, order=order)

# サインアップ（最初の一回だけ）
@app.post("/signup")
def signup(body: SignUpReq):
    try:
        store.create_user(body.username, body.password)
        return {"ok": True}
    except ValueError as e:
        raise HTTPException(409, str(e))
