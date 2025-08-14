from fastapi import HTTPException
from typing import List
from models.sales import CreateSaleRequest, SaleResponse
from repositories.sales_repositories import SalesRepository
import json


class SalesService:
    def __init__(self, sales_repo: SalesRepository):
        self.sales_repo = sales_repo

    def create_sale(self, sale_data: CreateSaleRequest, user: dict) -> SaleResponse:
        user_id = user.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="User not found")

        items_json = json.dumps([item.dict() for item in sale_data.items])

        sale_id = self.sales_repo.create_sale(
            items=items_json,
            total=sale_data.total,
            payment_method=sale_data.payment_method.value,
            user_id=user_id,
            status=sale_data.status.value,
        )

        if not sale_id:
            raise HTTPException(status_code=500, detail="Failed to create sale")

        sale = self.sales_repo.find_by_id(sale_id)
        return SaleResponse(**sale)

    def history_sales(self):
        sales = self.sales_repo.list_sales()
        return [SaleResponse(**sale) for sale in sales]

    def get_sale(self, sale_id):
        sale = self.sales_repo.find_by_id(sale_id)
        if not sale:
            raise HTTPException(status_code=404, detail="Sale not found")
        return SaleResponse(**sale)
