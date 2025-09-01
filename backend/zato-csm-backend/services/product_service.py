from fastapi import HTTPException
from typing import List

from models.product import CreateProductRequest
from repositories.product_repositories import ProductRepository


class ProductService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def create_product(
        self,
        product_data: CreateProductRequest,
        creator_id: str,
    ):
        unit_val = getattr(product_data.unit, "value", product_data.unit)
        type_val = getattr(
            product_data.product_type, "value", product_data.product_type
        )
        category_id_val = getattr(product_data, "category_id")

        return self.repo.create_product(
            name=product_data.name,
            description=product_data.description,
            price=float(product_data.price),
            stock=int(product_data.stock),
            unit=unit_val,
            product_type=type_val,
            category_id=category_id_val,
            sku=product_data.sku,
            min_stock=int(getattr(product_data, "min_stock", 0)),
            status=getattr(
                getattr(product_data, "status", "active"),
                "value",
                getattr(product_data, "status", "active"),
            ),
            weight=getattr(product_data, "weight", None),
            localization=getattr(product_data, "localization", None),
            creator_id=str(creator_id),
            images=[],
        )

    def list_products(self):
        return self.repo.find_all()

    def search_by_category(self, category: str):
        return self.repo.find_by_category(category)

    def search_by_name(self, name: str):
        return self.repo.find_by_name(name)

    def get_product(self, product_id: str):
        if not product_id or not isinstance(product_id, str):
            raise HTTPException(status_code=400, detail="Invalid product ID")

        product = self.repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def update_product(
        self,
        product_id: int,
        updates: dict,
        user_timezone: str = "UTC",
    ):
        allowed_fields = [
            "name",
            "description",
            "price",
            "stock",
            "category_id",
            "images",
            "sku",
            "weight",
            "localization",
            "min_stock",
            "status",
            "product_type",
            "unit",
        ]

        for field in list(updates.keys()):
            if field not in allowed_fields:
                raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

        for fld in (
            "product_type",
            "unit",
            "category_id",
            "description",
            "localization",
            "sku",
            "status",
        ):
            val = updates.get(fld)
            if val == "" or val is None:
                updates.pop(fld, None)

        if "price" in updates:
            try:
                updates["price"] = float(updates["price"])
                if updates["price"] <= 0:
                    raise HTTPException(
                        status_code=400, detail="Price must be positive"
                    )
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Invalid price value")

        if "stock" in updates:
            try:
                updates["stock"] = int(updates["stock"])
                if updates["stock"] < 0:
                    raise HTTPException(
                        status_code=400, detail="Stock cannot be negative"
                    )
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Invalid stock value")

        if "min_stock" in updates:
            try:
                updates["min_stock"] = int(updates["min_stock"])
                if updates["min_stock"] < 0:
                    raise HTTPException(
                        status_code=400, detail="min_stock cannot be negative"
                    )
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Invalid min_stock value")

        if "weight" in updates:
            try:
                updates["weight"] = float(updates["weight"])
                if updates["weight"] < 0:
                    raise HTTPException(status_code=400, detail="Invalid weight value")
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="Invalid weight value")

        images_list = updates.get("images")
        if images_list and isinstance(images_list, list):
            pass

        return self.repo.update_product(product_id, updates, user_timezone)

    def _process_images(self, images):
        processed = []
        for img in images:
            if hasattr(img, "filename"):
                processed.append(img.filename)
            else:
                processed.append(str(img))
        return processed

    def add_images(self, product_id: str, new_images: List[str]):
        return self.repo.add_images(int(product_id), new_images)

    def get_images(self, product_id: str):
        return self.repo.get_images(int(product_id))

    def delete_image(self, product_id: str, image_index: int):
        return self.repo.delete_image(int(product_id), image_index)

    def update_images(self, product_id: str, new_images: List[str]):
        return self.repo.update_images(int(product_id), new_images)
