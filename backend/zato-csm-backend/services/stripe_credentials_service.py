from fastapi import HTTPException
from repositories.stripe_credentials_repositories import StripeCredentialsRepository


class StripeCredentialsService:
    def __init__(self, repo: StripeCredentialsRepository):
        self.repo = repo

    def save_credentials(self, user_id: str, stripe_pub_key: str, stripe_sec_key: str):
        if not user_id or not stripe_pub_key or not stripe_sec_key:
            raise HTTPException(status_code=400, detail="Missing fields")

        return self.repo.create_for_user(user_id, stripe_pub_key, stripe_sec_key)

    def get_credentials(self, user_id: str):
        if not user_id:
            raise HTTPException(status_code=400, detail="Missing user id")
        creds = self.repo.get_by_user(user_id)
        if not creds:
            raise HTTPException(status_code=404, detail="Credentials not found")
        return creds

    def update_credentials(
        self, user_id: str, stripe_pub_key: str | None, stripe_sec_key: str | None
    ):
        updates = {}
        if stripe_pub_key is not None:
            updates["stripe_pub_key"] = stripe_pub_key
        if stripe_sec_key is not None:
            updates["stripe_sec_key"] = stripe_sec_key
        if not updates:
            raise HTTPException(status_code=400, detail="No updates provided")
        return self.repo.update_for_user(user_id, updates)

    def delete_credentials(self, user_id: str):
        if not user_id:
            raise HTTPException(status_code=400, detail="Missing user id")
        return self.repo.delete_for_user(user_id)
