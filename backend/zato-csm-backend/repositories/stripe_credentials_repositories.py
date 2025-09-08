from fastapi import HTTPException
from supabase import Client
from typing import Optional


class StripeCredentialsRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "stripe_credentials"

    def create_for_user(self, user_id: str, stripe_pub_key: str, stripe_sec_key: str):
        payload = {
            "user_id": user_id,
            "stripe_pub_key": stripe_pub_key,
            "stripe_sec_key": stripe_sec_key,
        }
        resp = self.supabase.table(self.table).upsert(payload).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(
                status_code=400, detail="Error saving stripe credentials"
            )
        return data[0]

    def get_by_user(self, user_id: str) -> Optional[dict]:
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            return None
        return data

    def update_for_user(self, user_id: str, updates: dict):
        updates.pop("id", None)
        resp = (
            self.supabase.table(self.table)
            .update(updates)
            .eq("user_id", user_id)
            .execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=404, detail="Stripe credentials not found")
        return data[0]

    def delete_for_user(self, user_id: str):
        resp = self.supabase.table(self.table).delete().eq("user_id", user_id).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=404, detail="Stripe credentials not found")
        return data[0]
