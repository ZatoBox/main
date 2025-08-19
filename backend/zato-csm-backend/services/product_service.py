from fastapi import HTTPException
from typing import List

from models.product import CreateProductRequest
from repositories.product_repositories import ProductRepository
from PIL import Image
import os
import io

class ProductService:
    def __init__(self, product_repo: ProductRepository):
        self.product_repo = product_repo

    def create_product(
        self,
        product_data: CreateProductRequest,
        creator_id: int,
        images: List = None
    ):
        # Processar upload de imagens
        images_paths = self._process_images(images) if images else []

        # Criar produto
        product = self.product_repo.create_product(
            name=product_data.name,
            description=product_data.description,
            price=product_data.price,
            stock=product_data.stock,
            category_id=product_data.category_id,
            images=images_paths,
            sku=product_data.sku,
            creator_id=creator_id,
            unit=product_data.unit.value,
            product_type=product_data.product_type.value,
            weight=product_data.weight,
            localization=product_data.localization,
            min_stock=product_data.min_stock or 0,
            status=product_data.status.value
        )
        return product

    def _process_images(self, images: List):
        if not images:
            return []

        ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}
        MAX_FILE_SIZE = 5 * 1024 * 1024 # 5MB em bytes

        image_paths = []
        upload_dir = "uploads/products/"
        os.makedirs(upload_dir, exist_ok=True)

        for image in images:
            ext = os.path.splitext(image.filename)[1].lower()

            # validação de formatos
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(status_code=400, detail=f"Invalid image format. Allowed: {'.'.join(ALLOWED_EXTENSIONS)}")

            image_content = image.file.read()

            # validação de tamanho
            file_size = len(image_content)
            if file_size > MAX_FILE_SIZE:
                size_mb = file_size / (1024 * 1024)
                raise HTTPException(status_code=400, detail=f"Image too large: {size_mb:.1f}MB. Maximum allowed: 5MB")

            # processamento da imagem
            try:
                img = Image.open(io.BytesIO(image_content))
                img.verify() # prevenção de uploads maliciosos
            except Exception:
                raise HTTPException(status_code=400, detail=f"Invalid image file: {image.filename}")

            filename = f"product-{int(os.times()[4] * 1000)}-{os.getpid()}{ext}"
            filepath = os.path.join(upload_dir, filename)
            with open(filepath, "wb") as f:
                f.write(image.file.read())
            image_paths.append(f"/uploads/products/{filename}")

            # resert file pointer para as próximas operações
            # image.file.seek(0)
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
