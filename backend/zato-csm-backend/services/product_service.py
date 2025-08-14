from fastapi import HTTPException
from typing import List

from repositories.product_repositories import ProductRepository

import os


class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def create_product(
        self,
        name: str,
        description: str,
        price: float,
        stock: int,
        category: str,
        images: List = None,
    ):
        # Validações
        if not name or not description or not category:
            raise HTTPException(status_code=400, detail="All fields are required")
        if price <= 0:
            raise HTTPException(status_code=400, detail="Price must be positive")
        if stock < 0:
            raise HTTPException(status_code=400, detail="Stock must be positive")

        # Processar upload de imagens
        images_paths = self._process_images(images) if images else []

        # Criar produto
        product = self.product_repo.create_product(
            name, description, price, stock, category, ",".join(images_paths)
        )
        return product

    def _process_images(self, images: List):
        image_paths = []
        upload_dir = "uploads/products/"
        os.makedirs(upload_dir, exist_ok=True)

        for image in images:
            ext = os.path.splitext(image.filename)[1]
            filename = f"product-{int(os.times()[4] * 1000)}-{os.getpid()}{ext}"
            filepath = os.path.join(upload_dir, filename)
            with open(filepath, "wb") as f:
                f.write(image.file.read())
            image_paths.append(f"/uploads/products/{filename}")
        return image_paths

    def list_products(self):
        # Buscar todos os produtos
        return self.product_repo.find_all()

    def search_by_category(self, category: str):
        return self.product_repo.find_by_category(category)

    def search_by_name(self, name: str):
        return self.product_repo.find_by_name(name)

    def get_product(self, product_id):
        if not product_id or product_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid product ID")

        product = self.product_repo.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def update_product(self, product_id: int, updates: dict, user_timezone: str = "UTC"):
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

        return self.product_repo.update_product(product_id, updates, user_timezone)

    def delete_product(self, product_id):
        return self.product_repo.delete_product(product_id)
