from fastapi import HTTPException, Depends, Request
from config.database import get_db_connection
from repositories.user_repositories import UserRepository
import jwt
from config.settings import SECRET_KEY, ALGORITHM


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(request: Request, db=Depends(get_db_connection)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ")[1]
    payload = verify_token(token)
    user_id = payload.get("user_id")

    # Use the provided PostgreSQL connection
    user_repo = UserRepository(db)
    user = user_repo.find_by_user_id(user_id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def get_current_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header.split(" ")[1]
    return token
