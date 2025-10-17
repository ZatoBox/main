# Tor Gateway - BTCPay

## Levantar

```bash
docker-compose up -d tor-gateway
```

Espera ~40 segundos a que Tor inicialice.

## Verificar

```bash
curl http://localhost:3001/health
```

## Usar desde Next.js

### Opción 1: API Route

```typescript
// src/app/api/payments/invoice/route.ts
const response = await fetch('http://tor-gateway:3001/api/btcpay/invoices', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

### Opción 2: Servicio

```typescript
import { btcpayService } from '@/services/btcpay.service';

const invoice = await btcpayService.post('invoices', {
  price: 100,
  currency: 'USD',
});
```

## Endpoints

- `POST /api/btcpay/*` - Reenvía a BTCPay vía Tor
- `GET /api/btcpay/*` - Obtiene datos de BTCPay
- `GET /health` - Verificar salud del gateway

## Variables

Tu `.env` tiene que tener:

```
BTCPAY_URL=http://...onion
BTCPAY_API_KEY=...
```

Para funcionar.

## Docker Compose

El `docker-compose.yml` en la raíz levanta:

- Gateway Tor en puerto 3001
- Lee automáticamente `.env`
- Health checks incluidos