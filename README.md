<<<<<<< HEAD
# 🚀 ZatoBox v2.0 - Intelligent Point of Sale System

A complete point of sale system with intelligent inventory, OCR, advanced product management, and professional configuration.

## ✨ Main Features

- 🛍️ **Product Management**: Complete CRUD with images and categorization
- 📊 **Intelligent Inventory**: Stock control and movements with AI
- 🔍 **Advanced OCR**: Automatic document and invoice scanning
- 💳 **Payment System**: Integrated multiple payment methods
- 📈 **Sales Reports**: Detailed analysis and export
- 🔐 **Secure Authentication**: JWT with user roles and 2FA
- ⚙️ **Complete Configuration**: Professional configuration panel
- 📱 **Modern Interface**: React + TypeScript + Tailwind CSS
- ⚡ **Robust Backend**: Node.js + Express + SQLite
- 🔌 **Plugin System**: Extensible and configurable modules

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Static typing for greater security
- **Vite** - Ultra-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Declarative navigation
- **Lucide React** - Modern and consistent icons
- **Vitest** - Fast testing framework
- **React Testing Library** - Component testing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Minimalist web framework
- **SQLite** - Lightweight and efficient database
- **JWT** - Stateless authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework
- **Supertest** - API testing

### DevOps & Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline
- **PowerShell Scripts** - Development automation

## 🚀 Installation and Configuration

### Prerequisites
- **Node.js** v18 or higher
- **npm** v8 or higher
- **Git** to clone the repository

### Quick Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/zatobox.git
cd zatobox
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the project**

#### Option A: Automatic Script (Recommended)
```powershell
# Windows PowerShell
.\start-project.ps1
```

#### Option B: Manual Commands
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

#### Option C: Both Services
```bash
npm run dev
```

## 📱 Application Access

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4444
- **Health Check**: http://localhost:4444/health
- **CORS Test**: test-cors.html (local file)

## 🔑 Test Credentials

### Administrator
- **Email**: `admin@frontposw.com`
- **Password**: `admin12345678`

### Regular User
- **Email**: `user@frontposw.com`
- **Password**: `user12345678`

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

### Complete Tests
```bash
npm run test
```

### Integration Tests
```bash
# Open test-cors.html in browser
# Or run the test script
node test-health.js
```

## 📁 Project Structure

```
FrontPOSw-main/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── HomePage.tsx
│   │   │   ├── InventoryPage.tsx
│   │   │   ├── NewProductPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── SideMenu.tsx
│   │   │   └── ...
│   │   ├── contexts/         # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── PluginContext.tsx
│   │   ├── config/           # Configuration
│   │   │   └── api.ts
│   │   ├── services/         # API services
│   │   │   └── api.ts
│   │   └── test/             # Frontend tests
│   ├── public/
│   │   ├── image/            # System images
│   │   │   └── logo.png
│   │   └── images/           # Brand logos
│   │       └── logozato.png
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js server
│   ├── src/
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Middleware
│   │   └── utils/            # Utilities
│   ├── test-server.js        # Development server
│   ├── users.json            # User data
│   └── package.json
├── shared/                   # Shared resources
│   └── images/               # Original images
├── docs/                     # Documentation
│   ├── README.md             # Documentation index
│   └── ...
├── scripts/                  # Automation scripts
├── start-project.ps1         # Start script
├── stop-project.ps1          # Stop script
├── test-cors.html            # CORS test file
├── test-health.js            # Health test script
└── package.json              # Root configuration
```

## 🔧 Available Scripts

### Main Scripts
```bash
npm run dev              # Start frontend and backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run build            # Production build
npm run test             # Complete tests
npm run lint             # Code verification
```

### Development Scripts
```bash
npm run install:all      # Install all dependencies
npm run clean            # Clean node_modules
npm run reset            # Complete project reset
```

### PowerShell Scripts
```powershell
.\start-project.ps1      # Automatically start entire project
.\stop-project.ps1       # Stop all services
```

## 🐛 Troubleshooting

### Port 4444 in use
```powershell
# Stop processes using the port
.\stop-project.ps1

# Or manually
Get-Process -Name "node" | Stop-Process -Force
```

### CORS Errors
- Verify backend is running on port 4444
- Use `test-cors.html` file to verify communication
- Check CORS configuration in `backend/test-server.js`

### Logos not showing
- Verify files are in `frontend/public/images/`
- Restart development server
- Clear browser cache

### Dependencies not found
```bash
# Reinstall dependencies
npm run clean
npm run install:all
# 🧾 OCR Invoice Processing Backend

Sistema OCR inteligente para procesamiento automático de facturas usando algoritmos de reconocimiento de patrones y Machine Learning.

## 🚀 Características

### ✨ Algoritmo Ultra Inteligente
- **Parser de Líneas Mixtas**: Detecta productos en formatos complejos donde toda la información está en una sola línea
- **Reconocimiento Multi-Patrón**: 3 patrones diferentes para máxima cobertura de detección
- **Extracción de Metadatos**: Fecha, número de factura, método de pago, totales financieros
- **Confianza Alta**: 95-98% de precisión en la extracción

### 🔧 Tecnologías Utilizadas
- **Flask**: Framework web REST API
- **Tesseract OCR**: Motor de reconocimiento óptico de caracteres
- **PDF2Image**: Conversión de PDF a imagen para procesamiento
- **OpenCV**: Preprocesamiento de imágenes
- **Docker**: Containerización para deployment
- **Python Regex**: Algoritmos de reconocimiento de patrones

## 📁 Estructura del Proyecto

```
backend-ocr/
├── app-light-fixed.py      # Aplicación principal con algoritmos
├── requirements-light.txt  # Dependencias Python optimizadas
├── docker-compose-light.yml # Configuración Docker
├── Dockerfile-minimal     # Imagen Docker optimizada
├── uploads/               # Directorio para archivos subidos
├── outputs/               # Directorio para resultados
└── README.md             # Este archivo
```

## 🐳 Instalación con Docker (Recomendado)

### Prerequisitos
- **Windows**: WSL2 (Windows Subsystem for Linux)
- **Docker** y **Docker Compose** instalados

### Pasos de Instalación

#### 1. Configurar WSL2 en Windows
```bash
# En PowerShell como Administrador
wsl --install
wsl --set-default-version 2

# Reiniciar el sistema
# Instalar Ubuntu desde Microsoft Store
```

#### 2. Instalar Docker en WSL2
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
sudo apt install docker.io docker-compose -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar WSL
exit
# Abrir nueva terminal WSL
```

#### 3. Clonar y Ejecutar el Proyecto
```bash
# Clonar el repositorio
git clone <repository-url>
cd backend-ocr

# Detener servicios previos
docker-compose -f docker-compose-light.yml down
 
# Construir imagen (primera vez o después de cambios)
docker-compose -f docker-compose-light.yml build --no-cache

# Levantar servicio
docker-compose -f docker-compose-light.yml up -d

# Verificar que está funcionando
sleep 20
curl -X GET http://localhost:8001/health
```

#### 4. Probar el Sistema
```bash
# Subir una factura PDF
curl -X POST http://localhost:8001/api/v1/invoice/process \\
  -F "file=@tu_factura.pdf"

# Ver logs en tiempo real
docker logs ocr-backend-light -f
>>>>>>> 7a9c480ed7d77bb084fc18da907da670acee374f
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - User profile
- `GET /api/auth/me` - Current user information

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id` - Get specific product

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get specific sale

### Inventory
- `GET /api/inventory` - Inventory status
- `POST /api/inventory/movements` - Record movement
- `GET /api/inventory/movements` - Movement history

### OCR
- `POST /api/ocr/upload` - Upload document for OCR
- `GET /api/ocr/history` - OCR history
- `GET /api/ocr/status/:jobId` - Processing status

### System
- `GET /health` - System health check
- `GET /api/health` - API health check

## 🎯 Features by Module

### 📦 Product Management
- ✅ Create, edit, delete products
- ✅ Automatic categorization
- ✅ Image management
- ✅ Stock control
- ✅ Automatic SKU
- ✅ Advanced search

### 📊 Intelligent Inventory
- ✅ Real-time stock control
- ✅ Low stock alerts
- ✅ Inventory movements
- ✅ AI for demand prediction
- ✅ Inventory reports

### 🔍 Advanced OCR
- ✅ Invoice scanning
- ✅ Document processing
- ✅ Automatic data extraction
- ✅ Processing history
- ✅ Multiple formats supported

### ⚙️ System Configuration
- ✅ General configuration
- ✅ Profile management
- ✅ Security settings
- ✅ Notifications
- ✅ Appearance and theme
- ✅ Plugin management
- ✅ System configuration

### 🔌 Plugin System
- ✅ Smart Inventory (AI)
- ✅ OCR Module
- ✅ POS Integration
- ✅ Plugin Store
- ✅ Dynamic activation/deactivation

## 🤝 Contribution

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow established code conventions
- Add tests for new features
- Update documentation as needed
- Verify all tests pass

## 📄 License

This project is under the MIT License. See the `LICENSE.txt` file for more details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder
- **Issues**: Report bugs in GitHub Issues
- **Discussions**: Join discussions on GitHub
- **Wiki**: Consult the project wiki

## 🎯 Roadmap

### Version 2.1 (Next)
- [ ] Payment gateway integration
- [ ] Native mobile app
- [ ] Advanced reports
- [ ] Accounting integration
- [ ] Multiple branches

### Version 3.0 (Future)
- [ ] Public API
- [ ] Plugin marketplace
- [ ] Advanced AI for predictions
- [ ] E-commerce integration
- [ ] Automatic backup system

## 📈 Project Metrics

- **Lines of code**: ~15,000+
- **React components**: 15+
- **API endpoints**: 20+
- **Tests**: 95%+ coverage
- **Performance**: <2s initial load
- **Compatibility**: Chrome, Firefox, Safari, Edge

## 🏆 Achievements

- ✅ **Clean code**: ESLint + Prettier configured
- ✅ **Complete testing**: Vitest + Jest + Testing Library
- ✅ **CI/CD**: GitHub Actions configured
- ✅ **Documentation**: Complete and updated
- ✅ **Automation scripts**: PowerShell scripts
- ✅ **Consistent branding**: ZatoBox throughout the application
- ✅ **Professional configuration**: Complete configuration panel

---

**ZatoBox v2.0** - Transforming digital commerce 🚀

*Developed with ❤️ to make commerce smarter and more efficient.* 
