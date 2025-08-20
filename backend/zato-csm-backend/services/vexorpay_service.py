"""
VexorPay Service for ZatoBox Backend
Handles payment processing, webhooks, and integration with VexorPay
"""

import os
import requests
import jwt
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from pydantic import BaseModel


class PaymentRequest(BaseModel):
    amount: float
    currency: str = "USD"
    description: str
    customer_email: str
    customer_name: str
    customer_phone: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentResponse(BaseModel):
    id: str
    status: str
    amount: float
    currency: str
    payment_url: Optional[str] = None
    created_at: datetime
    metadata: Optional[Dict[str, Any]] = None


class WebhookEvent(BaseModel):
    id: str
    type: str
    payment_id: str
    status: str
    amount: float
    currency: str
    timestamp: datetime
    signature: str


class VexorPayService:
    def __init__(self):
        self.api_key = os.getenv('VEXOR_API_KEY', '')
        self.webhook_secret = os.getenv('VEXOR_WEBHOOK_SECRET', '')
        self.environment = os.getenv('VEXOR_ENVIRONMENT', 'sandbox')
        self.base_url = self._get_base_url()
        
        if not self.api_key:
            raise ValueError("VEXOR_API_KEY environment variable is required")
    
    def _get_base_url(self) -> str:
        """Get VexorPay API base URL based on environment"""
        if self.environment == 'production':
            return 'https://api.vexorpay.com/v1'
        return 'https://sandbox-api.vexorpay.com/v1'
    
    def _get_headers(self) -> Dict[str, str]:
        """Get request headers for VexorPay API"""
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'ZatoBox/2.0'
        }
    
    async def create_payment(self, payment_data: PaymentRequest) -> PaymentResponse:
        """Create a new payment with VexorPay"""
        try:
            payload = {
                'amount': int(payment_data.amount * 100),  # Convert to cents
                'currency': payment_data.currency,
                'description': payment_data.description,
                'customer': {
                    'email': payment_data.customer_email,
                    'name': payment_data.customer_name,
                    'phone': payment_data.customer_phone,
                },
                'metadata': payment_data.metadata or {},
                'success_url': f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/payment/success",
                'cancel_url': f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/payment/cancel",
                'webhook_url': f"{os.getenv('BACKEND_URL', 'http://localhost:8000')}/api/payments/webhook"
            }
            
            response = requests.post(
                f'{self.base_url}/payments',
                json=payload,
                headers=self._get_headers(),
                timeout=30
            )
            
            if response.status_code == 201:
                data = response.json()
                return PaymentResponse(
                    id=data['id'],
                    status=data['status'],
                    amount=data['amount'] / 100,  # Convert back from cents
                    currency=data['currency'],
                    payment_url=data.get('payment_url'),
                    created_at=datetime.fromisoformat(data['created_at'].replace('Z', '+00:00')),
                    metadata=data.get('metadata')
                )
            else:
                response.raise_for_status()
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"VexorPay API error: {str(e)}")
        except Exception as e:
            raise Exception(f"Payment creation failed: {str(e)}")
    
    async def get_payment(self, payment_id: str) -> Optional[PaymentResponse]:
        """Get payment details by ID"""
        try:
            response = requests.get(
                f'{self.base_url}/payments/{payment_id}',
                headers=self._get_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return PaymentResponse(
                    id=data['id'],
                    status=data['status'],
                    amount=data['amount'] / 100,
                    currency=data['currency'],
                    payment_url=data.get('payment_url'),
                    created_at=datetime.fromisoformat(data['created_at'].replace('Z', '+00:00')),
                    metadata=data.get('metadata')
                )
            elif response.status_code == 404:
                return None
            else:
                response.raise_for_status()
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"VexorPay API error: {str(e)}")
    
    async def create_refund(self, payment_id: str, amount: Optional[float] = None) -> Dict[str, Any]:
        """Create a refund for a payment"""
        try:
            payload = {
                'payment_id': payment_id,
            }
            
            if amount is not None:
                payload['amount'] = int(amount * 100)  # Convert to cents
            
            response = requests.post(
                f'{self.base_url}/refunds',
                json=payload,
                headers=self._get_headers(),
                timeout=30
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                response.raise_for_status()
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"VexorPay API error: {str(e)}")
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify webhook signature from VexorPay"""
        if not self.webhook_secret:
            raise ValueError("VEXOR_WEBHOOK_SECRET is required for webhook verification")
        
        try:
            # VexorPay typically uses HMAC-SHA256
            expected_signature = hmac.new(
                self.webhook_secret.encode(),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            # Remove 'sha256=' prefix if present
            if signature.startswith('sha256='):
                signature = signature[7:]
            
            return hmac.compare_digest(expected_signature, signature)
        except Exception:
            return False
    
    async def handle_webhook(self, payload: bytes, signature: str) -> Dict[str, Any]:
        """Handle incoming webhook from VexorPay"""
        if not self.verify_webhook_signature(payload, signature):
            raise ValueError("Invalid webhook signature")
        
        try:
            import json
            event_data = json.loads(payload.decode())
            
            event = WebhookEvent(
                id=event_data['id'],
                type=event_data['type'],
                payment_id=event_data['data']['id'],
                status=event_data['data']['status'],
                amount=event_data['data']['amount'] / 100,
                currency=event_data['data']['currency'],
                timestamp=datetime.fromisoformat(event_data['created'].replace('Z', '+00:00')),
                signature=signature
            )
            
            # Process the webhook event based on type
            result = await self._process_webhook_event(event)
            
            return {
                'status': 'success',
                'event_id': event.id,
                'processed': True,
                'result': result
            }
            
        except Exception as e:
            raise Exception(f"Webhook processing failed: {str(e)}")
    
    async def _process_webhook_event(self, event: WebhookEvent) -> Dict[str, Any]:
        """Process different types of webhook events"""
        if event.type == 'payment.completed':
            return await self._handle_payment_completed(event)
        elif event.type == 'payment.failed':
            return await self._handle_payment_failed(event)
        elif event.type == 'payment.refunded':
            return await self._handle_payment_refunded(event)
        else:
            return {'message': f'Unhandled event type: {event.type}'}
    
    async def _handle_payment_completed(self, event: WebhookEvent) -> Dict[str, Any]:
        """Handle successful payment completion"""
        # Here you would typically:
        # 1. Update the sale record in your database
        # 2. Update inventory
        # 3. Send confirmation emails
        # 4. Trigger any business logic
        
        return {
            'action': 'payment_completed',
            'payment_id': event.payment_id,
            'amount': event.amount,
            'currency': event.currency
        }
    
    async def _handle_payment_failed(self, event: WebhookEvent) -> Dict[str, Any]:
        """Handle failed payment"""
        return {
            'action': 'payment_failed',
            'payment_id': event.payment_id,
            'amount': event.amount,
            'currency': event.currency
        }
    
    async def _handle_payment_refunded(self, event: WebhookEvent) -> Dict[str, Any]:
        """Handle payment refund"""
        return {
            'action': 'payment_refunded',
            'payment_id': event.payment_id,
            'amount': event.amount,
            'currency': event.currency
        }
    
    def get_supported_currencies(self) -> List[str]:
        """Get list of supported currencies"""
        return ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN', 'BRL']
    
    def calculate_fees(self, amount: float, currency: str = 'USD') -> Dict[str, float]:
        """Calculate processing fees (example implementation)"""
        # These would be actual VexorPay fees from their documentation
        fee_percentage = 0.029  # 2.9%
        fee_fixed = 0.30  # $0.30
        
        processing_fee = (amount * fee_percentage) + fee_fixed
        net_amount = amount - processing_fee
        
        return {
            'gross_amount': amount,
            'processing_fee': round(processing_fee, 2),
            'net_amount': round(net_amount, 2),
            'fee_percentage': fee_percentage,
            'fee_fixed': fee_fixed
        }


# Singleton instance
vexorpay_service = VexorPayService()
