from fastapi import HTTPException
from supabase import Client
from utils.timezone_utils import get_current_time_with_timezone


class SalesRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "sales"

    def create_sale(
        self,
        items: list,
        payment_method: str,
        creator_id: str,
        status: str = "completed",
        user_timezone: str = "UTC",
    ):
        for item in items:
            if "price" not in item or item["price"] is None:
                product_price = self._get_product_price(item["product_id"])
                item["price"] = product_price
        total = sum(it["quantity"] * it["price"] for it in items)
        payload = {
            "items": items,
            "total": total,
            "payment_method": payment_method,
            "creator_id": creator_id,
            "status": status,
            "created_at": get_current_time_with_timezone(user_timezone),
        }
        resp = self.supabase.table(self.table).insert(payload).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=400, detail="Error creating sale")
        return data[0]

    def _get_product_price(self, product_id: int) -> float:
        resp = (
            self.supabase.table("products")
            .select("price")
            .eq("id", product_id)
            .single()
            .execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(
                status_code=404, detail=f"Product with id {product_id} not found"
            )
        return data["price"]

    def find_by_id(self, sale_id: str):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("id", sale_id)
            .single()
            .execute()
        )
        data = getattr(resp, "data", None)
        return data

    def list_sales(self):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        data = getattr(resp, "data", None) or []
        return data
