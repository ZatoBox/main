import sqlite3
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
from config.database_sqlite import get_sqlite_connection, get_sqlite_connection_generator

class PaymentsRepositorySQLite:
    """
    Repositorio SQLite temporal para pagos Lightning
    Compatible con la interfaz PostgreSQL
    """
    
    def __init__(self):
        pass
    
    def save_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Guardar un pago en SQLite"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO payments (
                    order_id, invoice_id, payment_id, amount_msats, 
                    memo, status, raw, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                payment_data.get('order_id'),
                payment_data.get('invoice_id'),
                payment_data.get('payment_id'),
                payment_data.get('amount_msats'),
                payment_data.get('memo'),
                payment_data.get('status', 'PENDING'),
                json.dumps(payment_data.get('raw', {})),
                datetime.utcnow().isoformat(),
                datetime.utcnow().isoformat()
            ))
            
            payment_id = cursor.lastrowid
            conn.commit()
            
            cursor.execute("SELECT * FROM payments WHERE id = ?", (payment_id,))
            row = cursor.fetchone()
            
            result = dict(row) if row else {}
            if result.get('raw'):
                result['raw'] = json.loads(result['raw'])
            
            return result
    
    def find_by_invoice_id(self, invoice_id: str) -> Optional[Dict[str, Any]]:
        """Buscar pago por invoice_id"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM payments WHERE invoice_id = ?", (invoice_id,))
            row = cursor.fetchone()
            
            if row:
                result = dict(row)
                if result.get('raw'):
                    result['raw'] = json.loads(result['raw'])
                return result
            return None
    
    def find_by_payment_id(self, payment_id: str) -> Optional[Dict[str, Any]]:
        """Buscar pago por payment_id"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM payments WHERE payment_id = ?", (payment_id,))
            row = cursor.fetchone()
            
            if row:
                result = dict(row)
                if result.get('raw'):
                    result['raw'] = json.loads(result['raw'])
                return result
            return None
    
    def update_payment_status(self, invoice_id: str, status: str, 
                            payment_data: Optional[Dict[str, Any]] = None) -> bool:
        """Actualizar estado de un pago"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
        
        if payment_data:
            cursor.execute("""
                UPDATE payments 
                SET status = ?, raw = ?, updated_at = ?
                WHERE invoice_id = ?
            """, (
                status,
                json.dumps(payment_data),
                datetime.utcnow().isoformat(),
                invoice_id
            ))
        else:
            cursor.execute("""
                UPDATE payments 
                SET status = ?, updated_at = ?
                WHERE invoice_id = ?
            """, (
                status,
                datetime.utcnow().isoformat(),
                invoice_id
            ))
        
        conn.commit()
        return cursor.rowcount > 0
    
    def find_by_order(self, order_id: int) -> List[Dict[str, Any]]:
        """Buscar pagos por order_id"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM payments WHERE order_id = ?", (order_id,))
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            result = dict(row)
            if result.get('raw'):
                result['raw'] = json.loads(result['raw'])
            results.append(result)
        
        return results
    
    def get_payment_history(self, limit: int = 100, offset: int = 0,
                          status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Obtener historial de pagos"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
        
        query = "SELECT * FROM payments"
        params = []
        
        if status:
            query += " WHERE status = ?"
            params.append(status)
        
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            result = dict(row)
            if result.get('raw'):
                result['raw'] = json.loads(result['raw'])
            results.append(result)
        
        return results
    
    def cleanup_expired_invoices(self, expiry_time: datetime) -> int:
        """Marcar invoices expiradas"""
        with get_sqlite_connection() as conn:
            cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE payments 
            SET status = 'EXPIRED', updated_at = ?
            WHERE status = 'PENDING' AND created_at < ?
        """, (
            datetime.utcnow().isoformat(),
            expiry_time.isoformat()
        ))
        
        conn.commit()
        return cursor.rowcount