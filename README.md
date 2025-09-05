# 🚀 ZatoBox v2.0 - Sistema Inteligente de Punto de Venta

<div align="center">
  <a href="https://github.com/ZatoBox/main">
    <img src="public/logo.png" alt="ZatoBox Logo" width="200">
  </a>

  <p>
    Sistema completo de punto de venta con inventario inteligente, OCR, gestión avanzada de productos y configuración profesional.
    <br />
    <a href="https://github.com/ZatoBox/Documents"><strong>Explorar Documentación »</strong></a>
    <br />
    <br />
    <a href="https://youtu.be/gA_XNPI7Bbs?si=7t28gQsBMOhAyA_X">Ver Demo</a>
    ·
    <a href="https://github.com/ZatoBox/main/issues/new?labels=bug&template=bug-report---.md">Reportar Bug</a>
    ·
    <a href="https://github.com/ZatoBox/main/issues/new?labels=enhancement&template=feature-request---.md">Solicitar Funcionalidad</a>
  </p>
</div>


## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [OCR](#-ocr)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## 🔍 Descripción General

ZatoBox es un sistema de punto de venta moderno y completo que integra tres componentes principales:

- **Frontend**: Interfaz de usuario moderna construida con Next.js
- **Backend**: API REST robusta con FastAPI y panel de administración con Streamlit
- **OCR**: Servicio de reconocimiento óptico de caracteres con IA de Google Gemini

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │      OCR        │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 4444    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel/       │    │   Render /      │    │   Render /      │
│   Local Dev     │    │   Local Dev     │    │   Local Dev     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    Supabase     │
                       │   (Database)    │
                       └─────────────────┘
```

## 🎨 Frontend

### Tecnologías Principales

- **Framework**: Next.js 15.5.0 con React 19.1.0
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Estado**: Zustand
- **Formularios**: React Hook Form + Formik + Yup
- **Autenticación**: Supabase Auth
- **HTTP Client**: Axios

### Características Principales

- ✅ Interfaz moderna y responsive
- ✅ Sistema de autenticación completo
- ✅ Gestión de inventario en tiempo real
- ✅ Dashboard con gráficos y reportes
- ✅ Modo oscuro/claro
- ✅ Gestión de productos con imágenes
- ✅ Sistema de ventas integrado

### Iniciar el Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build
pnpm start
```

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_OCR_API_URL=http://localhost:8001
```

## ⚙️ Backend

### Arquitectura del Backend

El backend está dividido en dos componentes:

#### 1. API Principal (zato-csm-backend)

- **Framework**: FastAPI 0.116.1
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT + Supabase Auth
- **ORM**: Repositorio personalizado con psycopg2
- **Validación**: Pydantic 2.11.7

#### 2. Panel de Administración (admin-dashboard)

- **Framework**: Streamlit
- **Funcionalidad**: Dashboard administrativo con métricas
- **Integración**: Conecta con la API principal

### Características Principales

- ✅ API REST completa con documentación automática (Swagger)
- ✅ Sistema de autenticación JWT
- ✅ CRUD completo para productos, inventario, ventas
- ✅ Gestión de layouts de tienda
- ✅ Middleware personalizado
- ✅ Manejo de imágenes con Cloudinary
- ✅ Panel administrativo interactivo

### Iniciar el Backend

#### API Principal

```bash
cd backend/zato-csm-backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
uvicorn main:app --reload --port 4444
```

#### Panel de Administración

```bash
cd backend/admin-dashboard

# Instalar dependencias (si no las tienes)
pip install streamlit requests pandas

# Iniciar dashboard
streamlit run main.py --server.port 8080 (dashboard no esta andando)
```

### Variables de Entorno del Backend

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_service_role_key
SUPABASE_JWT_SECRET=tu_supabase_jwt_secret
SECRET_KEY=tu_secret_key_para_jwt
CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
```

### Endpoints Principales

- **Auth**: `/auth/login`, `/auth/register`, `/auth/me`
- **Productos**: `/products/` (CRUD completo)
- **Inventario**: `/inventory/` (gestión de stock)
- **Ventas**: `/sales/` (procesamiento de ventas)
- **Layouts**: `/layouts/` (configuración de tienda)

## 🔍 OCR

### Tecnologías

- **Framework**: FastAPI
- **IA**: Google Gemini 1.5 Flash
- **Procesamiento**: Análisis de imágenes con IA generativa

### Características

- ✅ Reconocimiento óptico de caracteres avanzado
- ✅ Extracción de datos de productos de imágenes
- ✅ Rate limiting (5 minutos entre peticiones por usuario)
- ✅ Procesamiento de múltiples formatos de imagen
- ✅ Integración con la API principal

### Iniciar el Servicio OCR

```bash
cd OCR

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key de Gemini

# Iniciar servidor
uvicorn main:app --reload --port 500
```

### Variables de Entorno del OCR

```env
GEMINI_API_KEY=tu_google_gemini_api_key
```

### Endpoints del OCR

- **POST** `/extract-product/`: Extrae información de productos de imágenes
- **GET** `/health`: Health check del servicio

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y pnpm
- Python 3.8+
- Cuenta de Supabase
- Cuenta de Google AI (para Gemini API)
- Cuenta de Cloudinary (opcional, para imágenes)

### Configuración Completa

1. **Clonar el repositorio**

```bash
git clone https://github.com/ZatoBox/main.git
cd main
```

2. **Configurar Base de Datos**

   - Crear proyecto en Supabase
   - Ejecutar migraciones SQL necesarias
   - Obtener URL y claves de API

3. **Configurar cada servicio** (seguir instrucciones específicas arriba)

4. **Orden de inicio recomendado**:
   1. Backend API (puerto 4444)
   2. Servicio OCR (puerto 5000)
   3. Frontend (puerto 3000)
   4. Panel Admin (puerto 8080)

## 🐳 Despliegue

### Docker

El proyecto incluye Dockerfiles para el backend y OCR:

```bash
# Construir imágenes
docker build -f Dockerfile.backend -t zatobox-backend .
docker build -f Dockerfile.ocr -t zatobox-ocr .

# Ejecutar contenedores
docker run -p 8000:8000 zatobox-backend
docker run -p 8001:8001 zatobox-ocr
```

### Producción

- **Frontend**: Vercel (recomendado)
- **Backend + OCR**: Railway, Render, o cualquier proveedor Docker
- **Base de Datos**: Supabase (ya incluido)

Ver `DEPLOYMENT.md` para instrucciones detalladas de despliegue.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia especificada en `LICENSE.txt`.

## 🔗 Enlaces Útiles

- [Documentación](https://github.com/ZatoBox/Documents)
- [Demo en Video](https://youtu.be/gA_XNPI7Bbs?si=7t28gQsBMOhAyA_X)
- [Issues](https://github.com/ZatoBox/main/issues)
- [Discord Community](https://discord.gg/FmdyRveX3G)

---

<div align="center">
	<p>Hecho con ❤️ por el equipo de ZatoBox</p>
</div>
