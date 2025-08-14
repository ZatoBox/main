from config.database import connect_postgres


def create_tables_sql():
    return """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        address VARCHAR(255),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        category VARCHAR(100),
        images TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT NOW()
    );
        
    CREATE TABLE IF NOT EXISTS inventory(
        id SERIAL PRIMARY KEY,
        product_id INT NOT NULL,
        product_name VARCHAR(255),
        quantity INT NOT NULL,
        min_stock INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
    
    CREATE TABLE IF NOT EXISTS sales(
        id SERIAL PRIMARY KEY,
        items TEXT,
        total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        user_id INT,
        status VARCHAR(20) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """


def init_database():
    conn = None
    cursor = None
    try:
        conn = connect_postgres()
        cursor = conn.cursor()

        # Execute each statement separately
        for statement in create_tables_sql().split(";"):
            stmt = statement.strip()
            if stmt:
                cursor.execute(stmt)

        conn.commit()
        print("Database initialized successfully!")

    except Exception as e:
        print(f"Error initializing database: {e}")
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass
        raise
    finally:
        if cursor:
            try:
                cursor.close()
            except Exception:
                pass
        if conn:
            try:
                conn.close()
            except Exception:
                pass
