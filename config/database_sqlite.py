import sqlite3
import os
from typing import Generator
from contextlib import contextmanager


DB_PATH = "zatobox_lightning.db"

@contextmanager
def get_sqlite_connection():
    """
    Conexión SQLite para testing temporal mientras configuras PostgreSQL
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Para acceso dict-like
    try:
        yield conn
    finally:
        conn.close()

def get_sqlite_connection_generator() -> Generator[sqlite3.Connection, None, None]:
    """
    Versión generator de la conexión SQLite
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Para acceso dict-like
    try:
        yield conn
    finally:
        conn.close()

def init_sqlite_db():
    """
    Inicializar base de datos SQLite con las tablas necesarias
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
 
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NULL,
            invoice_id TEXT UNIQUE,
            payment_id TEXT,
            amount_msats INTEGER NOT NULL,
            memo TEXT,
            status TEXT NOT NULL DEFAULT 'PENDING',
            raw TEXT,  -- JSON como TEXT en SQLite
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    
 
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_payments_payment ON payments(payment_id)")
    
    conn.commit()
    conn.close()
    
    print(f"Base de datos SQLite inicializada: {DB_PATH}")

if __name__ == "__main__":
    init_sqlite_db()