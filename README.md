
<div align="center">
  <a href="https://zatobox.io">
    <img src="shared/images/Frame 270988297.png" alt="ZatoBox Logo" width="1080">
  </a>

[![Contributors][contributors-shield]][contributors-url] [![Forks][forks-shield]][forks-url] [![Stargazers][stars-shield]][stars-url] [![Issues][issues-shield]][issues-url] [![LinkedIn][linkedin-shield]][linkedin-url] [![Discord][discord-shield]][discord-url]
[![License][license-shield]][license-url]
[![Status][status-shield]][status-url]
[![Version][version-shield]][version-url]

  <p>
    Most small businesses still run inventory and sales with spreadsheets, notes, and fragmented tools. ZatoBox is an open-source alternative: a simple POS + inventory workflow with an Smart Inventory (OCR importer) to digitize products directly from invoices. Bitcoin on-chain is optional and non-custodial.
	   <br />
    <br />
Status: actively developed. 
	  New modules and improvements are continuously being added as the platform expands.
    <br />
    <a href="https://zatobox.io"><strong>Visit our website »</strong></a>
    <br />
    <br />
    <a href="https://youtu.be/gA_XNPI7Bbs?si=7t28gQsBMOhAyA_X">Watch Demo</a>
    ·
    <a href="https://github.com/ZatoBox/main/issues/new?labels=bug&template=bug-report---.md">Report a Bug</a>
    ·
    <a href="https://github.com/ZatoBox/main/issues/new?labels=enhancement&template=feature-request---.md">Request a Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#general-description">General Description</a></li>
    <li><a href="#system-architecture">System Architecture</a></li>
	<li><a href="#technologies">Technologies</a></li>
    <li><a href="#frontend">Frontend</a></li>
    <li><a href="#backend">Backend</a></li>
    <li><a href="#ocr">OCR</a></li>
    <li><a href="#installation-and-configuration">Installation and Configuration</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#contribution">Contribution</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#useful-links">Useful Links</a></li>
  </ol>
</details>

## General Description

ZatoBox is a modern and comprehensive Point of Sale system that integrates three main components, designed to be modular and scalable:

-   **Frontend**: Modern user interface built with Next.js, React, and TypeScript.
-   **Backend**: Robust REST API with FastAPI and an administrative panel.
-   **OCR**: Optical Character Recognition service with Google Gemini 1.5 Flash.

## System Architecture

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

The frontend handles the user interface, the backend manages business logic and data persistence with Supabase (PostgreSQL) and Cloudinary for images. The OCR service extracts data from documents using Google Gemini 1.5 Flash.

## Technologies

## Technologies

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
![pnpm](https://skillicons.dev/icons?i=pnpm)
![Cloudflare](https://skillicons.dev/icons?i=cloudflare)


## Frontend

### Main Technologies

-   **Framework**: Next.js 15.5.0 with React 19.1.0
-   **Language**: TypeScript
-   **Styles**: Tailwind CSS 4
-   **UI Components**: Radix UI
-   **State Management**: Zustand and React Context API
-   **Forms**: React Hook Form + Formik + Yup
-   **Authentication**: Supabase Auth
-   **HTTP Client**: Axios

### Main Features

-   Modern and responsive interface for product, inventory, order, and subscription management.
-   Complete authentication system with JWT, including registration, login, and profile management. Social login integration is planned.
-   Real-time inventory management with filtering, bulk operations, and JSON product import.
-   Support for cash and cryptocurrency payments (BTCPay Server integration).
-   Online catalog management (ZatoLink). (working)
-   OCR integration for document processing and product creation from extracted data.
-   Plugin store to extend application functionality.
-   Product management with image uploads to Cloudinary.

### Starting the Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Development mode
pnpm dev
```

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_OCR_API_URL=http://localhost:8001
```

## Backend

### Backend Architecture

The backend is divided into two components:

#### 1. Main API (zato-csm-backend)

-   **Framework**: FastAPI 0.116.1
-   **Database**: Supabase (PostgreSQL)
-   **Authentication**: JWT + Supabase Auth
-   **ORM**: Custom repository with psycopg2
-   **Validation**: Pydantic 2.11.7
-   **Modules**: Authentication, profiles, categories, inventory, layouts, products, payments (cash and BTCPay), OCR.
-   **Image Management**: Cloudinary.
-   **Documentation**: Automatic OpenAPI (Swagger).

#### 2. Admin Panel (admin-dashboard)

-   **Framework**: Streamlit
-   **Functionality**: Administrative dashboard with metrics.
-   **Integration**: Connects with the main API.
-   **Current Status**: Currently not operational. Requires attention for functionality.

### Main Features

-   Complete REST API with automatic documentation (Swagger).
-   JWT authentication system with role-based access control.
-   Full CRUD for products, inventory, sales, and categories.
-   Store layout management.
-   Custom middleware for security and access control.
-   Image handling with Cloudinary.
-   Payment processing (cash and cryptocurrency via BTCPay Server).
-   Encryption/decryption functions (`zatobox/main/src/utils/crypto.ts`, `zatobox/main/src/utils/crypto.utils.ts`) for sensitive data handling.

### Starting the Backend

#### Main API

```bash
cd backend/zato-csm-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Start server
uvicorn main:app --reload --port 4444
```

#### Admin Panel

```bash
cd backend/admin-dashboard

# Install dependencies (if not already installed)
pip install streamlit requests pandas

# Start dashboard
streamlit run main.py --server.port 8080 (dashboard is not working)
```

### Backend Environment Variables

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
SECRET_KEY=your_secret_key_for_jwt
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Main Endpoints

-   **Auth**: `/auth/login`, `/auth/register`, `/auth/me`
-   **Products**: `/products/` (complete CRUD)
-   **Inventory**: `/inventory/` (stock management)
-   **Sales**: `/sales/` (sales processing)
-   **Layouts**: `/layouts/` (store configuration)
-   **OCR**: `/ocr/extract-data` (document data extraction)
-   **BTCPay**: `/btcpay/create-invoice`, `/btcpay/webhook`

## OCR

### Technologies

-   **Framework**: FastAPI
-   **AI**: Google Gemini 1.5 Flash
-   **Processing**: Image and PDF analysis with generative AI

### Features

-   Advanced optical character recognition.
-   Product data extraction from images and PDFs.
-   Rate limiting (5 minutes between requests per user) to manage API usage.
-   Processing of multiple image formats.
-   Integration with the main API for product creation.

### Starting the OCR Service

```bash
cd OCR

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Gemini API key

# Start server
uvicorn main:app --reload --port 500
```

### OCR Environment Variables

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### OCR Endpoints

-   **POST** `/extract-product/`: Extract product information from images.
-   **GET** `/health`: Service health check.

## Installation and Configuration

### Prerequisites

-   Node.js 18+ and pnpm
-   Python 3.8+
-   Supabase account
-   Google AI account (for Gemini API)
-   Cloudinary account (optional, for images)

### Complete Configuration

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ZatoBox/main.git
    cd main
    ```

2.  **Configure Database**

    -   Create a project in Supabase.
    -   Run necessary SQL migrations.
    -   Obtain URL and API keys.

3.  **Configure each service** (follow specific instructions above).

4.  **Recommended startup order**:
    1.  Backend API (port 4444)
    2.  OCR Service (port 5000)
    3.  Frontend (port 3000)
    4.  Admin Panel (port 8080) - *Note: The admin panel is not currently working.*

## Deployment

### Docker

The project includes Dockerfiles for the backend and OCR:

```bash
# Build images
docker build -f Dockerfile.backend -t zatobox-backend .
docker build -f Dockerfile.ocr -t zatobox-ocr .

# Run containers
docker run -p 8000:8000 zatobox-backend
docker run -p 8001:8001 zatobox-ocr
```

### Production

-   **Frontend**: Vercel (recommended)
-   **Backend + OCR**: Railway, Render, or any Docker provider.
-   **Database**: Supabase (already included).

Refer to `DEPLOYMENT.md` for detailed deployment instructions.

## Contribution

1.  Fork the project.
2.  Create a branch for your feature (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add: AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

### Top Contributors

<div>
  <a href="https://github.com/ZatoBox/main/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=ZatoBox/main" />
  </a>
</div>

## License

This project is licensed under the MIT License. See the `LICENSE.txt` file for more details.

## Useful Links

-   [Documentation](https://codewiki.google/github.com/zatobox/main)
-   [Video Demo](https://youtu.be/gA_XNPI7Bbs?si=7t28gQsBMOhAyA_X)
-   [Issues](https://github.com/ZatoBox/main/issues)
-   [Discord Community](https://discord.gg/FmdyRveX3G)

---

<div align="center">
	<p>Made with ❤️ by the ZatoBox team</p>
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
[version-shield]: https://img.shields.io/badge/version-2.0.2-blue?style=for-the-badge
[version-url]: https://github.com/ZatoBox/main/releases
```
