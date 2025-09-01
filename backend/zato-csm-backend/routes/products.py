from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
    Request,
)
from typing import Optional, List
from models.product import ProductResponse, CreateProductRequest, UpdateProductRequest
from repositories.product_repositories import ProductRepository
from utils.dependencies import get_current_user
from config.supabase import get_supabase_client
from services.product_service import ProductService
from utils.timezone_utils import get_user_timezone_from_request

router = APIRouter(prefix="/api/products", tags=["products"])


def _get_product_service(supabase=Depends(get_supabase_client)) -> ProductService:
    product_repo = ProductRepository(supabase)
    return ProductService(product_repo)


@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: CreateProductRequest = Body(...),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    product = product_service.create_product(
        product_data,
        creator_id=current_user["id"],
    )
    return ProductResponse(**product)


@router.post("/bulk", response_model=List[ProductResponse])
def create_products_bulk(
    products_data: List[CreateProductRequest] = Body(...),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    products = []
    for product_data in products_data:
        product = product_service.create_product(
            product_data,
            creator_id=current_user["id"],
        )
        products.append(ProductResponse(**product))
    return products


@router.get("/{product_id}")
def get_product(
    product_id: str,
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    product = product_service.get_product(product_id)
    return {"success": True, "message": "Product found", "product": product}


@router.put("/{product_id}")
def update_product(
    product_id: str,
    request: Request,
    updates: UpdateProductRequest = Body(...),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    user_timezone = get_user_timezone_from_request(request)
    product_updated = product_service.update_product(
        product_id, updates.dict(exclude_unset=True), user_timezone
    )
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
