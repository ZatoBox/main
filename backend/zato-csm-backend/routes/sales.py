from config.database import get_db_connection

from fastapi import APIRouter, Depends, HTTPException
from models.sales import SaleResponse, CreateSaleRequest
from services.sales_service import SalesService
from utils.dependencies import get_current_token, get_current_user
from repositories.sales_repositories import SalesRepository

router = APIRouter(prefix="/api/sales", tags=["sales"])


def _get_sale_service(db=Depends(get_db_connection)) -> SalesService:
    sales_repo = SalesRepository(db)
    return SalesService(sales_repo)


@router.post("/", response_model=SaleResponse)
def create_sale(
    sale_data: CreateSaleRequest,
    current_user=Depends(get_current_user),
    sales_service: SalesService = Depends(_get_sale_service),
):
    return sales_service.create_sale(sale_data, current_user)


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, sales_service: SalesService = Depends(_get_sale_service)):
    return sales_service.get_sale(sale_id)


@router.get("/", response_model=SaleResponse)
def get_sales_history(sales_service: SalesService = Depends(_get_sale_service)):
    return sales_service.history_sales()
