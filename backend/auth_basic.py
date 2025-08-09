# backend/auth_basic.py
import time
from typing import Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from passlib.hash import bcrypt
from sheet_store import SheetStore  # 既存のSheetsラッパを流用する前提

security = HTTPBasic()

# TTLキャッシュ：Usersシートを一定間隔で読み直す
_TTL = 60.0
_cache: Dict[str, str] = {}
_cache_at = 0.0

def _load_users_from_sheet() -> Dict[str, str]:
    """
    Usersシート（username, password_hash, enabled, updated_at）を読み、
    {username: password_hash} の辞書にする
    """
    store = SheetStore()
    rows = store.read_users()  # ← 下の「SheetStoreへの最小追記」を参照
    users: Dict[str, str] = {}
    for r in rows:
        en = str(r.get("enabled", "")).strip().lower()
        if en in ("true", "1", "yes", "y"):
            u = str(r.get("username", "")).strip()
            h = str(r.get("password_hash", "")).strip()
            if u and h:
                users[u] = h
    return users

def _get_users() -> Dict[str, str]:
    global _cache, _cache_at
    now = time.time()
    if now - _cache_at > _TTL:
        _cache = _load_users_from_sheet()
        _cache_at = now
    return _cache

def get_current_user(credentials: HTTPBasicCredentials = Depends(security)) -> Dict[str, str]:
    users = _get_users()
    u, p = credentials.username, credentials.password
    if u not in users or not bcrypt.verify(p, users[u]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return {"id": u, "username": u}
