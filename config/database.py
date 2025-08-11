import os
from dotenv import load_dotenv
import pymysql
import psycopg2
import psycopg2.extras

load_dotenv()  # Carga las variables del .env

# MySQL connection config
MYSQL_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', 'yourpassword'),
    'database': os.getenv('MYSQL_DB', 'zatobox'),
    'cursorclass': pymysql.cursors.DictCursor
}

# PostgreSQL connections config
POSTGRES_CONFIG = {
    'host': os.getenv('POSTGRES_HOST', 'localhost'),
    'user': os.getenv('POSTGRES_USER', 'postgres'),
    'password': os.getenv('POSTGRES_PASSWORD', 'banco@246'),
    'database': os.getenv('POSTGRES_DB', 'zatobox_csm_db'),
    'port': int(os.getenv('POSTGRES_PORT', 5432))
}

def get_mysql_db():
    conn = pymysql.connect(**MYSQL_CONFIG)
    try:
        yield conn
    finally:
        conn.close()

def get_postgres_db():
    conn = psycopg2.connect(**POSTGRES_CONFIG)
    try:
        yield conn
    finally:
        conn.close()

def get_db_connection(db_type: str='postgres'):
    if db_type == "mysql":
        return get_mysql_db()
    return get_postgres_db()