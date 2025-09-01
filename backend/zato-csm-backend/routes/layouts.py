from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Body,
)
from typing import Optional, List
from models.layout import LayoutResponse, CreateLayoutRequest, UpdateLayoutRequest
from repositories.layout_repositories import LayoutRepository
from utils.dependencies import get_current_user
from config.supabase import get_supabase_client
from services.layout_service import LayoutService

router = APIRouter(prefix="/api/layouts", tags=["layouts"])


def _get_layout_service(supabase=Depends(get_supabase_client)) -> LayoutService:
    layout_repo = LayoutRepository(supabase)
    return LayoutService(layout_repo)


@router.post("/")
def create_layout(
    layout_data: CreateLayoutRequest = Body(...),
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    layout = layout_service.create_layout(
        layout_data,
        owner_id=current_user["id"],
    )
    return {"success": True, "message": "Layout created successfully", "layout": layout}


@router.get("/{layout_slug}")
def get_layout(
    layout_slug: str,
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    layout = layout_service.get_layout(layout_slug)
    return {"success": True, "message": "Layout found", "layout": layout}


@router.put("/{layout_slug}")
def update_layout(
    layout_slug: str,
    updates: UpdateLayoutRequest = Body(...),
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    layout_updated = layout_service.update_layout(
        layout_slug, updates.dict(exclude_unset=True)
    )
    return {
        "success": True,
        "message": "Layout updated successfully",
        "layout": layout_updated,
    }


@router.delete("/{layout_slug}")
def delete_layout(
    layout_slug: str,
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    layout = layout_service.delete_layout(layout_slug)
    return {
        "success": True,
        "message": "Layout deleted successfully",
        "layout": layout,
    }


@router.get("/")
def list_layouts(
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    try:
        layouts = layout_service.list_layouts()
        return {"success": True, "layouts": layouts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching layouts: {str(e)}")


@router.get("/owner/{owner_id}")
def list_layouts_by_owner(
    owner_id: str,
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    try:
        layouts = layout_service.list_layouts_by_owner(owner_id)
        return {"success": True, "layouts": layouts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching layouts: {str(e)}")


@router.get("/inventory/{inventory_id}")
def list_layouts_by_inventory(
    inventory_id: str,
    current_user=Depends(get_current_user),
    layout_service=Depends(_get_layout_service),
):
    try:
        layouts = layout_service.list_layouts_by_inventory(inventory_id)
        return {"success": True, "layouts": layouts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching layouts: {str(e)}")
