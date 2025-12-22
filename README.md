```markdown
<div align="center">
  <a href="https://zatobox.io">
    <img src="shared/images/Frame 270988297.png" alt="ZatoBox Logo" width="1080">
  </a>

[![Contributors][contributors-shield]][contributors-url] [![Forks][forks-shield]][forks-url] [![Stargazers][stars-shield]][stars-url] [![Issues][issues-shield]][issues-url] [![LinkedIn][linkedin-shield]][linkedin-url] [![Discord][discord-shield]][discord-url]
[![License][license-shield]][license-url]
[![Status][status-shield]][status-url]
[![Version][version-shield]][version-url]

  <p>
    ZatoBox es un sistema de punto de venta (POS) modular y de código abierto diseñado para pymes y emprendedores. Ofrece gestión de inventario basada en la nube, catálogos en línea con ZatoLink, y una conexión de pagos a través de ZatoConnect. Además, incorpora módulos como Smart Inventory (con IA y OCR) y automatización. Está diseñado para ser simple, escalable y adaptable a cualquier negocio.
    <br />
    <a href="https://zatobox.io"><strong>Visita nuestro sitio web »</strong></a>
    <br />
    <br />
    <a href="https://youtu.be/gA_XNPI7Bbs?si=7t28gQsBMOhAyA_X">Ver Demo</a>
    ·
    <a href="https://github.com/ZatoBox/main/issues/new?labels=bug&template=bug-report---.md">Reportar un Bug</a>
    ·
    <a href="https://github.com/ZatoBox/main/issues/new?labels=enhancement&template=feature-request---.md">Solicitar una Característica</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li><a href="#descripción-general">Descripción General</a></li>
    <li><a href="#arquitectura-del-sistema">Arquitectura del Sistema</a></li>
	<li><a href="#tecnologías">Tecnologías</a></li>
    <li><a href="#frontend">Frontend</a></li>
    <li><a href="#backend">Backend</a></li>
    <li><a href="#ocr">OCR</a></li>
    <li><a href="#instalación-y-configuración">Instalación y Configuración</a></li>
    <li><a href="#despliegue">Despliegue</a></li>
    <li><a href="#contribución">Contribución</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#enlaces-útiles">Enlaces Útiles</a></li>
  </ol>
</details>

## Descripción General

ZatoBox es un sistema de punto de venta moderno y completo que integra tres componentes principales, diseñados para ser modulares y escalables:

-   **Frontend**: Interfaz de usuario moderna construida con Next.js, React y TypeScript.
-   **Backend**: API REST robusta con FastAPI y un panel de administración.
-   **OCR**: Servicio de reconocimiento óptico de caracteres con Google Gemini 1.5 Flash.

## Arquitectura del Sistema

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

El frontend se encarga de la interfaz de usuario, el backend gestiona la lógica de negocio y la persistencia de datos con Supabase (PostgreSQL) y Cloudinary para imágenes. El servicio OCR extrae datos de documentos utilizando Google Gemini 1.5 Flash.

## Tecnologías

![Next.js](https://skillicons.dev/icons?i=nextjs)
![React](https://skillicons.dev/icons?i=react)
![TypeScript](https://skillicons.dev/icons?i=ts)
![Python](https://skillicons.dev/icons?i=python)
![FastAPI](https://skillicons.dev/icons?i=fastapi)
![Supabase](https://skillicons.dev/icons?i=supabase)
![Tailwind CSS](https://skillicons.dev/icons?i=tailwind)
![Docker](https://skillicons.dev/icons?i=docker)
![PostgreSQL](https://skillicons.dev/icons?i=postgresql)
![Vercel](https://skillicons.dev/icons?i=vercel)
![Git](https://skillicons.dev/icons?i=git)
![GitHub](https://skillicons.dev/icons?i=github)

## Frontend

### Tecnologías Principales

-   **Framework**: Next.js 15.5.0 con React 19.1.0
-   **Lenguaje**: TypeScript
-   **Estilos**: Tailwind CSS 4
-   **Componentes UI**: Radix UI
-   **Gestión de Estado**: Zustand y React Context API
-   **Formularios**: React Hook Form + Formik + Yup
-   **Autenticación**: Supabase Auth
-   **Cliente HTTP**: Axios

### Características Principales

-   ✅ Interfaz moderna y responsive para gestión de productos, inventario, pedidos y suscripciones.
-   ✅ Sistema completo de autenticación con JWT, incluyendo registro, inicio de sesión y gestión de perfiles. Se prevé integración con inicio de sesión social.
-   ✅ Gestión de inventario en tiempo real con filtrado, operaciones masivas e importación de productos JSON.
-   ✅ Soporte para pagos en efectivo y criptomonedas (integración con BTCPay Server).
-   ✅ Gestión de catálogos en línea (ZatoLink).
-   ✅ Integración con OCR para procesamiento de documentos y creación de productos a partir de datos extraídos.
-   ✅ Tienda de plugins para extender la funcionalidad de la aplicación.
-   ✅ Modo oscuro/claro.
-   ✅ Gestión de productos con subida de imágenes a Cloudinary.

### Iniciando el Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Modo desarrollo
pnpm dev
```

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_OCR_API_URL=http://localhost:8001
```

## Backend

### Arquitectura del Backend

El backend se divide en dos componentes:

#### 1. API Principal (zato-csm-backend)

-   **Framework**: FastAPI 0.116.1
-   **Base de Datos**: Supabase (PostgreSQL)
-   **Autenticación**: JWT + Supabase Auth
-   **ORM**: Repositorio personalizado con psycopg2
-   **Validación**: Pydantic 2.11.7
-   **Módulos**: Autenticación, perfiles, categorías, inventario, layouts, productos, pagos (cash y BTCPay), OCR.
-   **Gestión de imágenes**: Cloudinary.
-   **Documentación**: OpenAPI (Swagger) automática.

#### 2. Panel de Administración (admin-dashboard)

-   **Framework**: Streamlit
-   **Funcionalidad**: Dashboard administrativo con métricas.
-   **Integración**: Se conecta con la API principal.
-   **Estado Actual**: Actualmente no está operativo. Requiere atención para su funcionamiento.

### Características Principales

-   ✅ API REST completa con documentación automática (Swagger).
-   ✅ Sistema de autenticación JWT con control de acceso basado en roles.
-   ✅ CRUD completo para productos, inventario, ventas y categorías.
-   ✅ Gestión de diseño de la tienda (layouts).
-   ✅ Middleware personalizado para seguridad y control de acceso.
-   ✅ Manejo de imágenes con Cloudinary.
-   ✅ Procesamiento de pagos (efectivo y criptomonedas via BTCPay Server).
-   ✅ Funciones de encriptación/desencriptación (`zatobox/main/src/utils/crypto.ts`, `zatobox/main/src/utils/crypto.utils.ts`) para manejo de datos sensibles. *Nota: La función `encryptString` en `crypto.ts` actualmente devuelve el texto plano y `decryptAny` en `crypto.utils.ts` también, lo que podría necesitar revisión si se busca una encriptación robusta en la API.*

### Iniciando el Backend

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
streamlit run main.py --server.port 8080 (dashboard is not working)
```

### Variables de Entorno del Backend

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
SECRET_KEY=your_secret_key_for_jwt
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Endpoints Principales

-   **Auth**: `/auth/login`, `/auth/register`, `/auth/me`
-   **Products**: `/products/` (CRUD completo)
-   **Inventory**: `/inventory/` (gestión de stock)
-   **Sales**: `/sales/` (procesamiento de ventas)
-   **Layouts**: `/layouts/` (configuración de la tienda)
-   **OCR**: `/ocr/extract-data` (extracción de datos de documentos)
-   **BTCPay**: `/btcpay/create-invoice`, `/btcpay/webhook`

## OCR

### Tecnologías

-   **Framework**: FastAPI
-   **IA**: Google Gemini 1.5 Flash
-   **Procesamiento**: Análisis de imágenes y PDFs con IA generativa

### Características

-   ✅ Reconocimiento óptico de caracteres avanzado.
-   ✅ Extracción de datos de productos desde imágenes y PDFs.
-   ✅ Limitación de tasa (5 minutos entre solicitudes por usuario) para gestionar el uso de la API.
-   ✅ Procesamiento de múltiples formatos de imagen.
-   ✅ Integración con la API principal para la creación de productos.

### Iniciando el Servicio OCR

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
# Editar .env con tu clave de API de Gemini

# Iniciar servidor
uvicorn main:app --reload --port 500
```

### Variables de Entorno del OCR

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Endpoints del OCR

-   **POST** `/extract-product/`: Extraer información de productos desde imágenes.
-   **GET** `/health`: Verificación del estado del servicio.

## Instalación y Configuración

### Prerrequisitos

-   Node.js 18+ y pnpm
-   Python 3.8+
-   Cuenta de Supabase
-   Cuenta de Google AI (para la API de Gemini)
-   Cuenta de Cloudinary (opcional, para imágenes)

### Configuración Completa

1.  **Clonar el repositorio**

    ```bash
    git clone https://github.com/ZatoBox/main.git
    cd main
    ```

2.  **Configurar Base de Datos**

    -   Crear proyecto en Supabase.
    -   Ejecutar las migraciones SQL necesarias.
    -   Obtener URL y claves de API.

3.  **Configurar cada servicio** (seguir las instrucciones específicas anteriores).

4.  **Orden de inicio recomendado**:
    1.  Backend API (puerto 4444)
    2.  OCR Service (puerto 5000)
    3.  Frontend (puerto 3000)
    4.  Admin Panel (puerto 8080) - *Nota: El panel de administración no está funcionando actualmente.*

## Despliegue

### Docker

El proyecto incluye Dockerfiles para el backend y el OCR:

```bash
# Construir imágenes
docker build -f Dockerfile.backend -t zatobox-backend .
docker build -f Dockerfile.ocr -t zatobox-ocr .

# Ejecutar contenedores
docker run -p 8000:8000 zatobox-backend
docker run -p 8001:8001 zatobox-ocr
```

### Producción

-   **Frontend**: Vercel (recomendado)
-   **Backend + OCR**: Railway, Render o cualquier proveedor de Docker.
-   **Base de Datos**: Supabase (ya incluido).

Consulta `DEPLOYMENT.md` para obtener instrucciones detalladas de despliegue.

## Contribución

1.  Haz un "fork" del proyecto.
2.  Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`).
3.  Confirma tus cambios (`git commit -m 'Add: AmazingFeature'`).
4.  Empuja a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

### Contribuidores Principales

<div>
  <a href="https://github.com/ZatoBox/main/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=ZatoBox/main" />
  </a>
</div>

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE.txt` para más detalles.

## Enlaces Útiles

-   [Documentación](https://github.com/ZatoBox/Documents)
-   [Video Demo](https://youtu.be/gA_XNPI7Bbs?si=7t28gQsBMOhAyA_X)
-   [Issues](https://github.com/ZatoBox/main/issues)
-   [Comunidad de Discord](https://discord.gg/FmdyRveX3G)

---

<div align="center">
	<p>Hecho con ❤️ por el equipo de ZatoBox</p>
</div>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/ZatoBox/main.svg?style=for-the-badge
[contributors-url]: https://github.com/ZatoBox/main/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ZatoBox/main.svg?style=for-the-badge
[forks-url]: https://github.com/ZatoBox/main/network/members
[stars-shield]: https://img.shields.io/github/stars/ZatoBox/main.svg?style=for-the-badge
[stars-url]: https://github.com/ZatoBox/main/stargazers
[issues-shield]: https://img.shields.io/badge/issues-0%20open-green?style=for-the-badge
[issues-url]: https://github.com/ZatoBox/main/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ikhunsa/
[discord-shield]: https://img.shields.io/badge/Discord-Join%20Chat-5865F2?style=for-the-badge&logo=discord&logoColor=white
[discord-url]: https://discord.gg/FmdyRveX3G
[license-shield]: https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge
[license-url]: LICENSE.txt
[status-shield]: https://img.shields.io/badge/status-active-success?style=for-the-badge
[status-url]: https://github.com/ZatoBox/main
[version-shield]: https://img.shields.io/badge/version-2.0.1-blue?style=for-the-badge
[version-url]: https://github.com/ZatoBox/main/releases
```
