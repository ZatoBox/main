from fastapi import HTTPException
from typing import List

from models.product import CreateProductRequest
from repositories.product_repositories import ProductRepository


class ProductService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def create_product(self, product_data: CreateProductRequest, creator_id: int):
        unit_val = getattr(product_data.unit, "value", product_data.unit)
        type_val = getattr(
            product_data.product_type, "value", product_data.product_type
        )
        category_val = getattr(product_data.category, "value", product_data.category)

        return self.repo.create_product(
            name=product_data.name,
            description=product_data.description,
            price=float(product_data.price),
            stock=int(product_data.stock),
            unit=unit_val,
            product_type=type_val,
            category=category_val,
            sku=product_data.sku,
            min_stock=int(getattr(product_data, "min_stock", 0)),
            status=getattr(
                getattr(product_data, "status", "active"),
                "value",
                getattr(product_data, "status", "active"),
            ),
            weight=getattr(product_data, "weight", None),
            localization=getattr(product_data, "localization", None),
            creator_id=creator_id,
        )

    def list_products(self):
        return self.repo.find_all()

    def search_by_category(self, category: str):
        return self.repo.find_by_category(category)

    def search_by_name(self, name: str):
        return self.repo.find_by_name(name)

    def get_product(self, product_id):
        if not product_id or product_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid product ID")

        product = self.repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def update_product(
        self, product_id: int, updates: dict, user_timezone: str = "UTC"
    ):
        # Validation allowed fields
        allowed_fields = ["name", "description", "price", "stock", "category", "images"]

        for field in list(updates.keys()):
            if field not in allowed_fields:
                raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

        if "price" in updates and updates["price"] <= 0:
            raise HTTPException(status_code=400, detail="Price must be positive")
        if "stock" in updates and updates["stock"] < 0:
            raise HTTPException(status_code=400, detail="Stock cannot be negative")

        images = updates.get("images")
        if images and isinstance(images, list):
            updates["images"] = self._process_images(images)

        return self.repo.update_product(product_id, updates, user_timezone)

    def delete_product(self, product_id):
        return self.repo.delete_product(product_id)
