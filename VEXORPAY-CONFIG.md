# Configuración Variables de Ambiente VexorPay

## 🔧 Archivos de Configuración

### Frontend (.env)
**Ubicación**: `/frontend/.env`

```env
# VexorPay Configuration
VITE_VEXOR_API_KEY=tu_api_key_real
VITE_VEXOR_ENVIRONMENT=production
VITE_DEBUG=false
```

### Backend (.env)
**Ubicación**: `/backend/zato-csm-backend/.env`

```env
# VexorPay Configuration
VEXOR_API_KEY=tu_api_key_real
VEXOR_WEBHOOK_SECRET=tu_webhook_secret_real
VEXOR_ENVIRONMENT=production
```

## 🚀 Pasos para Configurar

### 1. Obtener Credenciales VexorPay
1. Crear cuenta en [VexorPay Dashboard](https://dashboard.vexorpay.com)
2. Completar verificación KYC
3. Obtener API Key de producción
4. Generar Webhook Secret

### 2. Actualizar Archivos .env
Reemplazar los valores placeholder con tus credenciales reales:

```bash
# Frontend
cd frontend
nano .env

# Backend  
cd backend/zato-csm-backend
nano .env
```

### 3. Reiniciar Servicios
```bash
# Reiniciar frontend
cd frontend
npm run dev

# Reiniciar backend
cd backend/zato-csm-backend
source venv/bin/activate
python run.py
```

## 🔒 Seguridad

### ⚠️ Importante
- **NUNCA** subir archivos .env al repositorio
- Usar `.env.example` para plantillas
- Mantener credenciales seguras
- Usar variables diferentes para desarrollo/producción

### 📋 Variables por Ambiente

#### Desarrollo (Sandbox)
```env
VITE_VEXOR_API_KEY=vexor_pk_sandbox_xxxx
VITE_VEXOR_ENVIRONMENT=sandbox
VEXOR_API_KEY=vexor_sk_sandbox_xxxx
VEXOR_ENVIRONMENT=sandbox
```

#### Producción
```env
VITE_VEXOR_API_KEY=vexor_pk_live_xxxx
VITE_VEXOR_ENVIRONMENT=production
VEXOR_API_KEY=vexor_sk_live_xxxx
VEXOR_ENVIRONMENT=production
```

## 🧪 Verificar Configuración

### Logs Frontend (Consola del navegador)
```javascript
VexorPay initialized with config: {
  apiKey: "vexor_pk_live_xxxx",
  environment: "production",
  debug: false
}
```

### Logs Backend
```python
# En la consola del servidor
VexorPay Service initialized: production mode
API Key: vexor_sk_live_xxxx (masked)
Environment: production
```

## 🔄 Transición Mock → Producción

### Antes (Mock)
- Sin API keys requeridas
- Respuestas simuladas
- URLs mock

### Después (Producción)
- API keys reales requeridas
- Transacciones reales
- URLs VexorPay reales

### Cambios Necesarios en Código
```typescript
// En src/services/vexorpay.ts
// Reemplazar MockVexor con SDK real
import VexorPay from '@vexorpay/sdk';

const vexorPay = new VexorPay({
  apiKey: VEXOR_CONFIG.apiKey,
  environment: VEXOR_CONFIG.environment
});
```

## 🆘 Solución de Problemas

### Error: "Invalid API Key"
- Verificar que API key es correcta
- Confirmar que está en archivo .env correcto
- Reiniciar servicios después de cambios

### Error: "Environment Mismatch"
- Verificar VITE_VEXOR_ENVIRONMENT = production
- Confirmar VEXOR_ENVIRONMENT = production en backend
- Usar claves de producción, no sandbox

### Error: Variables no se cargan
- Verificar sintaxis .env (sin espacios alrededor del =)
- Confirmar archivos .env en ubicaciones correctas
- Reiniciar completamente los servicios

---

**Status**: ✅ Configuración lista para producción VexorPay
**Última actualización**: 20 Agosto 2025
