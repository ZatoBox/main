from fastapi import HTTPException
from typing import List
from datetime import datetime
from repositories.product_repositories import ProductRepository


class InventoryService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def get_inventory(self):
        products = self.product_repo.find_all()
        inventory = []

        return [
            {
                "id": p["id"],
                "productId": p["id"],
                "quantity": p["stock"],
                "minStock": p.get("min_stock", 0),
                "lastUpdated": p.get("last_updated", datetime.now().isoformat() + "Z"),
            }
            for p in products
        ]

    def get_inventory_by_user(self, user_id: int):
        products = self.product_repo.find_by_creator(user_id)
        return [
            {
                "id": p["id"],
                "productId": p["id"],
                "quantity": p["stock"],
                "minStock": p.get("min_stock", 0),
                "lastUpdated": p.get("last_updated", datetime.now().isoformat() + "Z"),
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
            "productId": updated_product["id"],
            "quantity": updated_product["stock"],
            "lastUpdated": updated_product.get(
                "last_updated", datetime.now().isoformat() + "Z"
            ),
        }

    def check_low_stock(self, min_threshold: int = 0):
        """Function to check low stock products"""
        products = self.product_repo.find_all()

        return [
            {
                "id": p["id"],
                "currentStock": p["stock"],
                "minStock": min_threshold,
                "needRestock": True,
            }
            for p in products
            if p["stock"] <= min_threshold
        ]

    def get_inventory_summary(self):
        """Inventory summary functionality"""
        products = self.product_repo.find_all()

        total_products = len(products)
        total_stock = sum(p["stock"] for p in products)
        low_stock_count = len([p for p in products if p["stock"] <= 0])

        return {
            "totalProducts": total_products,
            "totalStock": total_stock,
            "lowStockProducts": low_stock_count,
            "lastUpdated": datetime.now().isoformat() + "Z",
        }
