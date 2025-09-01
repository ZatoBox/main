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
    # current_user=Depends(get_current_user),  # Comentado para testing
    product_service=Depends(_get_product_service),
):
    products = []
    for i, product_data in enumerate(products_data):
        try:
            product = product_service.create_product(
                product_data,
                creator_id="749262c7-e7fa-4905-b4d0-5737f2c8c860",
            )
            products.append(ProductResponse(**product))
        except Exception as e:
            # Si hay error (ej. SKU duplicado), intentar con SKU modificado
            if "duplicate key value violates unique constraint" in str(e):
                try:
                    # Modificar el SKU agregando un sufijo
                    modified_data = product_data.copy()
                    modified_data.sku = f"{product_data.sku}_{i+1}"
                    product = product_service.create_product(
                        modified_data,
                        creator_id="749262c7-e7fa-4905-b4d0-5737f2c8c860",
                    )
                    products.append(ProductResponse(**product))
                except Exception as e2:
                    # Si aún falla, saltar este producto
                    print(f"Error creando producto {i+1}: {str(e2)}")
                    continue
            else:
                # Otro error, saltar
                print(f"Error creando producto {i+1}: {str(e)}")
                continue
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
