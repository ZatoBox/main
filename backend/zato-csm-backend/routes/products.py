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

from models.product import ProductResponse, CreateProductRequest
from repositories.product_repositories import ProductRepository
from utils.dependencies import get_current_user
from config.supabase import get_supabase_client

from services.product_service import ProductService
from utils.timezone_utils import get_user_timezone_from_request

router = APIRouter(prefix="/api/products", tags=["products"])

"""
This function aims to create repository and service instance for this Route.
"""


def _get_product_service(supabase=Depends(get_supabase_client)) -> ProductService:
    product_repo = ProductRepository(supabase)
    return ProductService(product_repo)


@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: CreateProductRequest,
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    product = product_service.create_product(
        product_data,
        creator_id=current_user["id"],
    )
    return ProductResponse(**product)


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
    category_id: Optional[str] = Form(None),
    weight: Optional[float] = Form(None),
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
    if category_id is not None:
        updates["category_id"] = category_id
    if weight is not None:
        updates["weight"] = weight

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
