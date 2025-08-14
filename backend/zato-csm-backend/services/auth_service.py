from repositories.user_repositories import UserRepository
from fastapi import HTTPException
from typing import Optional
from datetime import datetime, timedelta
from jwt import (
    encode as jwt_encode,
    decode as jwt_decode,
    ExpiredSignatureError,
    InvalidTokenError,
)
from config.settings import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.password_utils import hash_password, verify_password


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
        self.blacklisted_token = set()

    def create_access_token(
        self, data: dict, expires_delta: Optional[timedelta] = None
    ):
        to_encode = data.copy()
        expire = datetime.utcnow() + (
            expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode.update({"exp": expire})
        encoded_jwt = jwt_encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def login(self, email: str, password: str):
        # Validations
        if not email or not password:
            raise HTTPException(
                status_code=400, detail="Email and password are required"
            )

        # Finding by user
        user = self.user_repo.find_by_email(email)

        # Business rule
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Verify password
        try:
            if not verify_password(password, user["password"]):
                raise HTTPException(status_code=401, detail="Invalid credentials")
        except Exception as e:
            print(f"Password verification error: {e}")
            raise HTTPException(status_code=500, detail="Authentication error")

        # Remove password from user data before returning
        user_data = dict(user)
        user_data.pop("password", None)

        # Generates token
        try:
            token = self.create_access_token({"user_id": user["id"]})
        except Exception as e:
            print(f"Token creation error: {e}")
            raise HTTPException(status_code=500, detail="Token generation error")

        return {"user": user_data, "token": token}

    def register(
        self,
        full_name: str,
        email: str,
        password: str,
        phone: str = None,
        address: str = None,
    ):
        """
        Where will register user
        :param email: string
        :param password: string
        :param fullName: string
        :param phone: string
        :param address: string
        :return:

        Also, will make validations of email existent
        """
        # Validation input data
        if not email or not password or not full_name:
            raise HTTPException(
                status_code=400, detail="Email, password and fullname are required"
            )
        # Check if user already exists
        user = self.user_repo.find_by_email(email)
        if user:
            raise HTTPException(status_code=409, detail="Email already exists")

        # Crypt password
        hashed_password = hash_password(password)

        # Create user
        try:
            user_id = self.user_repo.create_user(
                full_name, email, hashed_password, phone, address
            )
            print(f"User created with ID: {user_id}")
        except Exception as e:
            print(f"User creation error: {e}")
            raise HTTPException(status_code=500, detail="User creation failed")

        # Login with original password
        try:
            return self.login(email, password)
        except Exception as e:
            print(f"Auto-login after register failed: {e}")
            # Return success even if auto-login fails
            return {
                "success": True,
                "message": "User created successfully. Please login manually.",
            }

    def logout(self, token: str):
        self.blacklisted_token.add(token)
        return {"success": True, "message": "Successful logout"}

    def verify_token(self, token: str):
        """
        Objective: verify if token is valid (for endpoints /api/auth/me)
        :param token:
        :return:
        """
        try:
            payload = jwt_decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("user_id")
            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid Token")
            user = self.user_repo.find_by_user_id(user_id)
            if not user:
                raise HTTPException(status_code=401, detail="User not found")

            return user
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid Token")

    def is_token_blacklisted(self, token: str) -> bool:
        return token in self.blacklisted_token

    def get_list_users(self):
        users = self.user_repo.find_all_users()
        return {"success": True, "users": users}

    def get_profile_user(self, user_id):
        user = self.user_repo.find_by_user_id(user_id)
        return {"success": True, "user": user}

    def update_profile(self, user_id: int, updates: dict):
        user = self.user_repo.update_profile(user_id, updates)
        return {"success": True, "user": user}
