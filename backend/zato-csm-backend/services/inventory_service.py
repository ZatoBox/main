from fastapi import HTTPException
from typing import List
from datetime import datetime
from repositories.product_repositories import ProductRepository


class InventoryService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def get_inventory(self):
        products = self.product_repo.find_all()
        return [
            {
                "id": p["id"],
                "product_id": p["id"],
                "quantity": p.get("stock", 0),
                "location": p.get("location"),
                "updated_at": p.get("last_updated", datetime.now().isoformat() + "Z"),
                "product": p,
            }
            for p in products
        ]

    def get_inventory_by_user(self, user_id: int):
        products = self.product_repo.find_by_creator(user_id)
        return [
            {
                "id": p["id"],
                "product_id": p["id"],
                "quantity": p.get("stock", 0),
                "location": p.get("location"),
                "updated_at": p.get("last_updated", datetime.now().isoformat() + "Z"),
                "product": p,
            }
            for p in products
        ]

    def update_stock(self, product_id: int, quantity: int, user_timezone: str = "UTC"):
        if quantity < 0:
            raise HTTPException(status_code=400, detail="Quantity cannot be negative")

        updated_product = self.product_repo.update_product(
            product_id, {"stock": quantity}, user_timezone
        )

        if not updated_product:
            raise HTTPException(status_code=404, detail="Product not found")

        return {
            "id": updated_product["id"],
            "product_id": updated_product["id"],
            "quantity": updated_product.get("stock", 0),
            "updated_at": updated_product.get("last_updated", datetime.now().isoformat() + "Z"),
            "product": updated_product,
        }

    def check_low_stock(self, min_threshold: int = 0):
        products = self.product_repo.find_all()
        return [
            {
                "id": p["id"],
                "product_id": p["id"],
                "quantity": p.get("stock", 0),
                "min_threshold": min_threshold,
                "need_restock": True,
                "product": p,
            }
            for p in products
            if p.get("stock", 0) <= min_threshold
        ]

    def get_inventory_summary(self):
        products = self.product_repo.find_all()
        total_products = len(products)
        total_stock = sum(p.get("stock", 0) for p in products)
        low_stock_count = len([p for p in products if p.get("stock", 0) <= 0])
        return {
            "totalProducts": total_products,
            "totalStock": total_stock,
            "lowStockProducts": low_stock_count,
            "lastUpdated": datetime.now().isoformat() + "Z",
        }
