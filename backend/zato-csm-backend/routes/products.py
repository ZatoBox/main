from fastapi import (
    APIRouter,
    Form,
    UploadFile,
    File,
    Depends,
    HTTPException,
    Body,
    Request,
)
from typing import List, Optional
import os

from repositories.product_repositories import ProductRepository
from utils.dependencies import get_current_user
from config.database import get_db_connection

from services.product_service import ProductService
from utils.timezone_utils import get_user_timezone_from_request

router = APIRouter(prefix="/api/products", tags=["products"])

"""
This function aims to create repository and service instance for this Route.
"""


def _get_product_service(db=Depends(get_db_connection)) -> ProductService:
    product_repo = ProductRepository(db)  # postgres is default bank
    return ProductService(product_repo)


@router.post("/")
def create_product(
    request: Request,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    category: str = Form(...),
    unit_id: int = Form(...),
    product_type: str = Form(...),
    weight: float = Form(...),
    min_sock: int = Form(None, ge=0),
    sku: str = Form(None),
    localization: str = Form(None),
    images: List[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    user_timezone = get_user_timezone_from_request(request)
    product = product_service.create_product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=category,
        sku=sku,
        unit_id=unit_id,
        product_type=product_type,
        creator_id=current_user['id'],
        images=images,
        weight=weight,
        min_stock=min_sock,
        localization=localization
    )
    return {
        "success": True,
        "message": "Product created successfully",
        "product": product,
    }


@router.get("/{product_id}")
def get_product(
    product_id: int,
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    product = product_service.get_product(product_id)
    return {"success": True, "message": "Product found", "product": product}


@router.put("/{product_id}")
async def update_product(
    request: Request,
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    images: List[UploadFile] = File(None),
    body: Optional[dict] = Body(None),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    user_timezone = get_user_timezone_from_request(request)

    updates = {}

    if body:
        updates.update(body)

    if name is not None:
        updates["name"] = name
    if description is not None:
        updates["description"] = description
    if price is not None:
        updates["price"] = price
    if stock is not None:
        updates["stock"] = stock
    if category is not None:
        updates["category"] = category

    if images:
        updates["images"] = images

    if not updates:
        try:
            raw = await request.json()
            if isinstance(raw, dict):
                updates.update(raw)
        except Exception:
            pass

    if not updates:
        raise HTTPException(status_code=400, detail="No update fields provided")

    product_updated = product_service.update_product(product_id, updates, user_timezone)
    return {
        "success": True,
        "message": "Product updated successfully",
        "product": product_updated,
    }


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    product = product_service.delete_product(product_id)
    return {
        "success": True,
        "message": "Product deleted successfully",
        "product": product,
    }


@router.get("/")
def list_products(
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    try:
        products = product_service.list_products()
        return {"success": True, "products": products}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching products: {str(e)}"
        )
