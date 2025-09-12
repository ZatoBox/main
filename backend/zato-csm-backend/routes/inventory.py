from fastapi import APIRouter, Depends, Request, Query
from config.supabase import get_supabase_client
from services.inventory_service import InventoryService
from utils.dependencies import get_current_user
from utils.timezone_utils import get_user_timezone_from_request
from typing import Optional

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


def _get_inventory_service(supabase=Depends(get_supabase_client)) -> InventoryService:
    return InventoryService(supabase)


@router.get("")
def get_inventory(
    user=Depends(get_current_user), inventory_service=Depends(_get_inventory_service)
):
    """Obtiene el inventory del usuario actual"""
    inventory_response = inventory_service.get_inventory_response(user["id"])
    return inventory_response.dict()


@router.get("/user")
def get_user_inventory(
    user=Depends(get_current_user), inventory_service=Depends(_get_inventory_service)
):
    """Obtiene el inventory del usuario actual (alias de /)"""
    inventory_response = inventory_service.get_inventory_response(user["id"])
    return inventory_response.dict()


@router.get("/summary")
def get_inventory_summary(
    user=Depends(get_current_user), inventory_service=Depends(_get_inventory_service)
):
    """Obtiene un resumen del inventory del usuario"""
    summary = inventory_service.get_inventory_summary(user["id"])
    return {"success": True, "summary": summary}


@router.get("/low-stock")
def get_low_stock_products(
    threshold: int = Query(0, description="Umbral de stock bajo"),
    user=Depends(get_current_user),
    inventory_service=Depends(_get_inventory_service),
):
    """Obtiene productos con stock bajo"""
    low_stock_items = inventory_service.check_low_stock(user["id"], threshold)
    return {
        "success": True,
        "low_stock_products": [item.dict() for item in low_stock_items],
    }


@router.put("/{product_id}")
def update_inventory(
    product_id: str,
    quantity: int,
    request: Request,
    reason: Optional[str] = None,
    user=Depends(get_current_user),
    inventory_service=Depends(_get_inventory_service),
):
    """Actualiza el stock de un producto en el inventory del usuario"""
    user_timezone = get_user_timezone_from_request(request)
    result = inventory_service.update_stock(
        product_id, quantity, user["id"], user_timezone, reason
    )
    return {
        "success": True,
        "message": "Stock updated successfully",
        "product": result.dict(),
    }


@router.get("/{product_id}")
def get_inventory_item(
    product_id: str,
    user=Depends(get_current_user),
    inventory_service=Depends(_get_inventory_service),
):
    """Obtiene un item específico del inventory"""
    item = inventory_service.get_inventory_item(user["id"], product_id)
    if not item:
        return {"success": False, "message": "Product not found in inventory"}

    return {"success": True, "product": item.dict()}
