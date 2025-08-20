
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(32) DEFAULT 'INVOICE',
ADD COLUMN IF NOT EXISTS payment_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS fees_msats BIGINT,
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB;


DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'payments' AND column_name = 'raw') THEN
        ALTER TABLE payments RENAME COLUMN raw TO metadata;
    END IF;
END $$;


CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(customer_email);


CREATE TABLE IF NOT EXISTS webhook_events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    data JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_entity ON webhook_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON webhook_events(created_at);


CREATE TABLE IF NOT EXISTS payment_statistics (
    id SERIAL PRIMARY KEY,
    period_date DATE NOT NULL,
    total_invoices INTEGER DEFAULT 0,
    total_paid INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    total_expired INTEGER DEFAULT 0,
    total_volume_msats BIGINT DEFAULT 0,
    total_fees_msats BIGINT DEFAULT 0,
    unique_customers INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(period_date)
);

CREATE INDEX IF NOT EXISTS idx_payment_statistics_date ON payment_statistics(period_date);

-- MySQL version (comentado, descomenta si usas MySQL)
/*
-- Agregar columnas faltantes
ALTER TABLE payments 
ADD COLUMN payment_type VARCHAR(32) DEFAULT 'INVOICE' AFTER payment_id,
ADD COLUMN payment_hash VARCHAR(255) AFTER status,
ADD COLUMN fees_msats BIGINT AFTER amount_msats,
ADD COLUMN customer_email VARCHAR(255) AFTER order_id,
ADD COLUMN paid_at TIMESTAMP NULL AFTER updated_at;

-- Cambiar tipo de columna raw/metadata si es necesario
ALTER TABLE payments CHANGE COLUMN raw metadata JSON;

-- Crear índices
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_created ON payments(created_at);
CREATE INDEX idx_payments_email ON payments(customer_email);

-- Crear tabla para eventos de webhook
CREATE TABLE IF NOT EXISTS webhook_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    data JSON,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_entity ON webhook_events(entity_id);
CREATE INDEX idx_webhook_events_created ON webhook_events(created_at);

-- Crear tabla para estadísticas
CREATE TABLE IF NOT EXISTS payment_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    period_date DATE NOT NULL,
    total_invoices INT DEFAULT 0,
    total_paid INT DEFAULT 0,
    total_failed INT DEFAULT 0,
    total_expired INT DEFAULT 0,
    total_volume_msats BIGINT DEFAULT 0,
    total_fees_msats BIGINT DEFAULT 0,
    unique_customers INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_period (period_date)
);

CREATE INDEX idx_payment_statistics_date ON payment_statistics(period_date);
*/