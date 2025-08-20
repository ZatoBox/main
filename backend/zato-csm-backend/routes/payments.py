"""
Payment routes for VexorPay integration
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json

from config.database import get_db_connection
from services.vexorpay_service import vexorpay_service, PaymentRequest
from utils.dependencies import get_current_user

router = APIRouter(prefix="/api/payments", tags=["payments"])


class CreatePaymentRequest(BaseModel):
    amount: float
    currency: str = "USD"
    description: str
    items: list = []
    customer_info: Optional[Dict[str, Any]] = None


class PaymentStatusRequest(BaseModel):
    payment_id: str


@router.post("/create")
async def create_payment(
    payment_data: CreatePaymentRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db_connection)
):
    """Create a new payment with VexorPay"""
    try:
        # Validate payment amount
        if payment_data.amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than 0")
        
        # Prepare payment request for VexorPay
        vexor_payment = PaymentRequest(
            amount=payment_data.amount,
            currency=payment_data.currency,
            description=payment_data.description,
            customer_email=current_user.get('email', ''),
            customer_name=current_user.get('full_name', 'Customer'),
            customer_phone=current_user.get('phone'),
            metadata={
                'user_id': current_user.get('id'),
                'items': payment_data.items,
                'source': 'zatobox-pos',
                'customer_info': payment_data.customer_info
            }
        )
        
        # Create payment with VexorPay
        payment_response = await vexorpay_service.create_payment(vexor_payment)
        
        # Here you could save the payment to your database
        # payment_record = {
        #     'payment_id': payment_response.id,
        #     'user_id': current_user['id'],
        #     'amount': payment_response.amount,
        #     'currency': payment_response.currency,
        #     'status': payment_response.status,
        #     'items': payment_data.items,
        #     'created_at': payment_response.created_at
        # }
        # save_payment_to_db(payment_record, db)
        
        return {
            'success': True,
            'payment': {
                'id': payment_response.id,
                'status': payment_response.status,
                'amount': payment_response.amount,
                'currency': payment_response.currency,
                'payment_url': payment_response.payment_url,
                'created_at': payment_response.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment creation failed: {str(e)}")


@router.get("/status/{payment_id}")
async def get_payment_status(
    payment_id: str,
    current_user=Depends(get_current_user)
):
    """Get payment status from VexorPay"""
    try:
        payment = await vexorpay_service.get_payment(payment_id)
        
        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        return {
            'success': True,
            'payment': {
                'id': payment.id,
                'status': payment.status,
                'amount': payment.amount,
                'currency': payment.currency,
                'created_at': payment.created_at.isoformat(),
                'metadata': payment.metadata
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get payment status: {str(e)}")


@router.post("/refund")
async def create_refund(
    payment_id: str = Body(...),
    amount: Optional[float] = Body(None),
    current_user=Depends(get_current_user)
):
    """Create a refund for a payment"""
    try:
        # Check if user has permission to create refunds
        if current_user.get('role') != 'admin':
            raise HTTPException(status_code=403, detail="Only administrators can create refunds")
        
        refund_response = await vexorpay_service.create_refund(payment_id, amount)
        
        return {
            'success': True,
            'refund': refund_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refund creation failed: {str(e)}")


@router.post("/webhook")
async def handle_vexorpay_webhook(request: Request):
    """Handle webhooks from VexorPay"""
    try:
        # Get raw request body
        body = await request.body()
        
        # Get signature from headers
        signature = request.headers.get('X-VexorPay-Signature', '')
        if not signature:
            raise HTTPException(status_code=400, detail="Missing webhook signature")
        
        # Process webhook
        result = await vexorpay_service.handle_webhook(body, signature)
        
        return JSONResponse(
            status_code=200,
            content=result
        )
        
    except ValueError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Other webhook processing errors
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")


@router.get("/currencies")
async def get_supported_currencies():
    """Get list of supported currencies"""
    try:
        currencies = vexorpay_service.get_supported_currencies()
        return {
            'success': True,
            'currencies': currencies
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get currencies: {str(e)}")


@router.post("/calculate-fees")
async def calculate_fees(
    amount: float = Body(...),
    currency: str = Body("USD")
):
    """Calculate processing fees for a payment amount"""
    try:
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than 0")
        
        fees = vexorpay_service.calculate_fees(amount, currency)
        
        return {
            'success': True,
            'fees': fees
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fee calculation failed: {str(e)}")


@router.get("/health")
async def payment_service_health():
    """Check VexorPay service health"""
    try:
        # This would typically ping VexorPay API to check connectivity
        return {
            'success': True,
            'service': 'VexorPay',
            'status': 'operational',
            'environment': vexorpay_service.environment
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Service health check failed: {str(e)}")
