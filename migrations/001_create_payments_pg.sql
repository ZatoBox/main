CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NULL,
  invoice_id TEXT UNIQUE,
  payment_id TEXT,
  amount_msats BIGINT NOT NULL,
  memo TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment ON payments(payment_id);
