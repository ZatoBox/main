# ZatoBox - Guía de Configuración y Ejecución

## 📋 Resumen del Proyecto

**ZatoBox v2.0** es un sistema completo de punto de venta con las siguientes características principales:

- 🚀 **Frontend React + TypeScript** (Puerto 5173)
- ⚡ **Backend FastAPI + Python** (Puerto 8000)
- 🔍 **Servicio OCR con Flask** (Puerto 5000)
- 🗄️ **Base de datos PostgreSQL**

## 🎯 Estado Actual de la Configuración

✅ **Backend FastAPI**: Configurado y ejecutándose en puerto 8000
✅ **Servicio OCR**: Configurado y ejecutándose en puerto 5000  
✅ **Base de datos PostgreSQL**: Configurada con usuario y base de datos
✅ **Frontend React**: Configurado (pendiente de ejecutar)

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Script Automático (Recomendado)

```bash
# Ir al directorio del proyecto
cd /home/omarqv/ZatoBox-Project/main

# Ver estado de todos los servicios
./manage-zatobox.sh status

# Iniciar todos los servicios
./manage-zatobox.sh start

# Reiniciar todos los servicios
./manage-zatobox.sh restart

# Detener todos los servicios
./manage-zatobox.sh stop
```

### Opción 2: Manual

#### 1. Backend (FastAPI)
```bash
cd /home/omarqv/ZatoBox-Project/main/backend/zato-csm-backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend (React + Vite)
```bash
cd /home/omarqv/ZatoBox-Project/main/frontend
npm run dev
```

#### 3. Servicio OCR (Flask)
```bash
cd /home/omarqv/ZatoBox-Project/main/OCR
source venv/bin/activate
python app_light_fixed.py
```

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación web principal |
| **Backend API** | http://localhost:8000 | API REST del backend |
| **API Docs** | http://localhost:8000/docs | Documentación Swagger |
| **OCR Service** | http://localhost:5000 | Servicio de procesamiento OCR |

## 🔧 Configuración de la Base de Datos

### Credenciales PostgreSQL
- **Host**: localhost
- **Puerto**: 5432
- **Usuario**: zatobox_user
- **Contraseña**: zatobox123
- **Base de datos**: zatobox_csm_db

### Comandos útiles
```bash
# Conectar a la base de datos
psql -h localhost -U zatobox_user -d zatobox_csm_db

# Ver estado del servicio PostgreSQL
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

## 📁 Estructura del Proyecto

```
ZatoBox-Project/main/
├── backend/
│   └── zato-csm-backend/          # Backend FastAPI
│       ├── venv/                  # Entorno virtual Python
│       ├── .env                   # Variables de entorno
│       ├── main.py               # Aplicación principal
│       └── requirements.txt      # Dependencias Python
├── frontend/                      # Frontend React
│   ├── node_modules/             # Dependencias Node.js
│   ├── .env                      # Variables de entorno
│   ├── package.json              # Configuración npm
│   └── src/                      # Código fuente React
├── OCR/                          # Servicio OCR
│   ├── venv/                     # Entorno virtual Python
│   ├── .env                      # Variables de entorno
│   ├── app_light_fixed.py        # Aplicación OCR
│   └── requirements-light.txt    # Dependencias Python
├── manage-zatobox.sh             # Script de gestión
└── README-SETUP.md              # Esta guía
```

## 🔍 Solución de Problemas

### Frontend no inicia
```bash
cd frontend
npm install
npm run dev
```

### Backend da error de base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión a la base de datos
psql -h localhost -U zatobox_user -d zatobox_csm_db -c "SELECT 1;"
```

### OCR no funciona
```bash
# Verificar que Tesseract esté instalado
tesseract --version

# Reinstalar dependencias OCR
cd OCR
source venv/bin/activate
pip install -r requirements-light.txt
```

## 📊 Variables de Entorno

### Backend (.env)
```env
POSTGRES_HOST=localhost
POSTGRES_USER=zatobox_user
POSTGRES_PASSWORD=zatobox123
POSTGRES_DATABASE=zatobox_csm_db
POSTGRES_PORT=5432
SECRET_KEY=your_very_long_and_secure_secret_key_here_replace_in_production_123456789
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_OCR_API_URL=http://localhost:5000/api/v1/invoice/process
VITE_APP_NAME=ZatoBox OCR
VITE_APP_VERSION=2.0.0
VITE_OCR_MAX_FILE_SIZE=52428800
VITE_OCR_SUPPORTED_FORMATS=pdf,png,jpg,jpeg,tiff,bmp
```

### OCR (.env)
```env
FLASK_ENV=development
HOST=127.0.0.1
PORT=5000
MAX_CONTENT_LENGTH=52428800
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
CORS_ALLOW_ALL=true
```

## 📝 Próximos Pasos

1. **Ejecutar el frontend**: `./manage-zatobox.sh start`
2. **Probar la aplicación**: Abrir http://localhost:5173
3. **Configurar datos iniciales**: Crear usuarios y productos de prueba
4. **Probar funcionalidad OCR**: Subir facturas de prueba
5. **Configurar autenticación**: Configurar JWT y roles de usuario

## 🆘 Soporte

Si encuentras problemas:

1. Ejecuta `./manage-zatobox.sh status` para ver el estado
2. Revisa los logs de cada servicio
3. Verifica que todos los puertos estén disponibles
4. Asegúrate de que PostgreSQL esté ejecutándose

---

**Desarrollado por**: Equipo ZatoBox  
**Versión**: 2.0.0  
**Fecha**: 20 de Agosto, 2025
