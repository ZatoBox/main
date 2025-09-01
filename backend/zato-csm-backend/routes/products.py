from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
    Request,
    Form,
    File,
    UploadFile,
)
from typing import Optional, List
from models.product import ProductResponse, CreateProductRequest, UpdateProductRequest
from repositories.product_repositories import ProductRepository
from utils.dependencies import get_current_user
from config.supabase import get_supabase_client
from services.product_service import ProductService
from utils.timezone_utils import get_user_timezone_from_request
from utils.cloudinary_utils import upload_multiple_images

router = APIRouter(prefix="/api/products", tags=["products"])


def _get_product_service(supabase=Depends(get_supabase_client)) -> ProductService:
    product_repo = ProductRepository(supabase)
    return ProductService(product_repo)


@router.post("/", response_model=ProductResponse)
def create_product(
    name: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    unit: str = Form(...),
    product_type: str = Form(...),
    category_id: Optional[str] = Form(None),
    description: str = Form(...),
    sku: str = Form(...),
    weight: Optional[float] = Form(None),
    localization: Optional[str] = Form(None),
    status: str = Form(...),
    min_stock: int = Form(0),
    images: List[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    product_data = CreateProductRequest(
        name=name,
        price=price,
        stock=stock,
        unit=unit,
        product_type=product_type,
        category_id=category_id,
        description=description,
        sku=sku,
        weight=weight,
        localization=localization,
        status=status,
        min_stock=min_stock,
    )

    image_urls = []
    if images:
        image_urls = upload_multiple_images(images)

    product = product_service.create_product(
        product_data,
        creator_id=current_user["id"],
        images=image_urls,
    )
    return ProductResponse(**product)


@router.post("/bulk", response_model=List[ProductResponse])
def create_products_bulk(
    products_data: List[CreateProductRequest] = Body(...),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    products = []
    for i, product_data in enumerate(products_data):
        try:
            product = product_service.create_product(
                product_data,
                creator_id=current_user["id"],
                images=[],
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
                        creator_id=current_user["id"],
                        images=[],
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
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    category_id: Optional[str] = Form(None),
    sku: Optional[str] = Form(None),
    weight: Optional[float] = Form(None),
    localization: Optional[str] = Form(None),
    min_stock: Optional[int] = Form(None),
    status: Optional[str] = Form(None),
    product_type: Optional[str] = Form(None),
    unit: Optional[str] = Form(None),
    images: List[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    product_service=Depends(_get_product_service),
):
    user_timezone = get_user_timezone_from_request(request)

    updates = {}
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
    if sku is not None:
        updates["sku"] = sku
    if weight is not None:
        updates["weight"] = weight
    if localization is not None:
        updates["localization"] = localization
    if min_stock is not None:
        updates["min_stock"] = min_stock
    if status is not None:
        updates["status"] = status
    if product_type is not None:
        updates["product_type"] = product_type
    if unit is not None:
        updates["unit"] = unit

    image_urls = []
    if images:
        image_urls = upload_multiple_images(images)
        updates["images"] = image_urls

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
