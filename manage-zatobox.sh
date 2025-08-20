#!/bin/bash

# ZatoBox Project Management Script
# Este script ayuda a gestionar todos los servicios de ZatoBox

PROJECT_ROOT="/home/omarqv/ZatoBox-Project/main"
BACKEND_DIR="$PROJECT_ROOT/backend/zato-csm-backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
OCR_DIR="$PROJECT_ROOT/OCR"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar información
show_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Función para mostrar advertencia
show_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Función para mostrar error
show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if ss -tlnp | grep -q ":$port "; then
        return 0
    else
        return 1
    fi
}

# Función para mostrar el estado de los servicios
show_status() {
    echo
    show_info "=== ESTADO DE SERVICIOS ZATOBOX ==="
    echo
    
    # Backend (Puerto 8000)
    if check_port 8000; then
        show_success "✅ Backend: Ejecutándose en puerto 8000"
        echo "   📍 API: http://localhost:8000"
        echo "   📚 Docs: http://localhost:8000/docs"
    else
        show_warning "❌ Backend: No ejecutándose"
    fi
    
    # Frontend (Puerto 5173)
    if check_port 5173; then
        show_success "✅ Frontend: Ejecutándose en puerto 5173"
        echo "   🌐 App: http://localhost:5173"
    else
        show_warning "❌ Frontend: No ejecutándose"
    fi
    
    # OCR (Puerto 5000)
    if check_port 5000; then
        show_success "✅ OCR Service: Ejecutándose en puerto 5000"
        echo "   🔍 API: http://localhost:5000"
    else
        show_warning "❌ OCR Service: No ejecutándose"
    fi
    
    echo
    show_info "=== BASE DE DATOS ==="
    
    # PostgreSQL
    if systemctl is-active --quiet postgresql; then
        show_success "✅ PostgreSQL: Servicio activo"
        
        # Verificar conectividad a la base de datos
        if sudo -u postgres psql -d zatobox_csm_db -c "SELECT 1;" &>/dev/null; then
            show_success "✅ Base de datos: Conexión exitosa"
        else
            show_warning "❌ Base de datos: Error de conexión"
        fi
    else
        show_error "❌ PostgreSQL: Servicio inactivo"
    fi
    
    echo
}

# Función para iniciar todos los servicios
start_all() {
    show_info "Iniciando todos los servicios de ZatoBox..."
    
    # Verificar PostgreSQL
    if ! systemctl is-active --quiet postgresql; then
        show_info "Iniciando PostgreSQL..."
        sudo systemctl start postgresql
    fi
    
    # Iniciar Backend
    if ! check_port 8000; then
        show_info "Iniciando Backend..."
        cd "$BACKEND_DIR"
        gnome-terminal --tab --title="ZatoBox Backend" -- bash -c "
            source venv/bin/activate && 
            uvicorn main:app --host 0.0.0.0 --port 8000 --reload;
            exec bash
        " &
        sleep 3
    fi
    
    # Iniciar OCR
    if ! check_port 5000; then
        show_info "Iniciando OCR Service..."
        cd "$OCR_DIR"
        gnome-terminal --tab --title="ZatoBox OCR" -- bash -c "
            source venv/bin/activate && 
            python app_light_fixed.py;
            exec bash
        " &
        sleep 3
    fi
    
    # Iniciar Frontend
    if ! check_port 5173; then
        show_info "Iniciando Frontend..."
        cd "$FRONTEND_DIR"
        gnome-terminal --tab --title="ZatoBox Frontend" -- bash -c "
            npm run dev;
            exec bash
        " &
        sleep 3
    fi
    
    sleep 5
    show_status
}

# Función para detener todos los servicios
stop_all() {
    show_info "Deteniendo todos los servicios de ZatoBox..."
    
    # Detener procesos por puerto
    for port in 8000 5173 5000; do
        pid=$(ss -tlnp | grep ":$port " | grep -o 'pid=[0-9]*' | cut -d'=' -f2 | head -1)
        if [ ! -z "$pid" ]; then
            show_info "Deteniendo proceso en puerto $port (PID: $pid)"
            kill $pid 2>/dev/null
        fi
    done
    
    sleep 2
    show_success "Servicios detenidos"
}

# Función para reiniciar todos los servicios
restart_all() {
    show_info "Reiniciando todos los servicios de ZatoBox..."
    stop_all
    sleep 3
    start_all
}

# Función para mostrar logs
show_logs() {
    show_info "Mostrando logs recientes..."
    echo
    show_info "=== LOGS POSTGRESQL ==="
    sudo tail -n 20 /var/log/postgresql/postgresql-16-main.log 2>/dev/null || echo "No se encontraron logs de PostgreSQL"
}

# Función para crear usuarios por defecto
create_default_users() {
    show_info "Creando usuarios por defecto con contraseñas hasheadas..."
    
    if [ -f "$PROJECT_ROOT/update-hashed-users.sh" ]; then
        cd "$PROJECT_ROOT"
        ./update-hashed-users.sh
    else
        show_error "Script de actualización de usuarios no encontrado"
        return 1
    fi
}

# Función para mostrar credenciales
show_credentials() {
    echo
    show_info "=== CREDENCIALES DE ACCESO ==="
    echo
    show_success "👨‍💼 Administrador:"
    echo "   📧 Email: admin@frontposw.com"
    echo "   🔑 Password: admin12345678"
    echo
    show_success "👤 Usuario regular:"
    echo "   📧 Email: user@frontposw.com"
    echo "   🔑 Password: user12345678"
    echo
    show_info "🌐 Acceso: http://localhost:5173"
    echo
}

# Función para mostrar ayuda
show_help() {
    echo
    echo "🚀 ZatoBox Project Management Script"
    echo
    echo "Uso: $0 [comando]"
    echo
    echo "Comandos disponibles:"
    echo "  status       - Mostrar el estado de todos los servicios"
    echo "  start        - Iniciar todos los servicios"
    echo "  stop         - Detener todos los servicios"
    echo "  restart      - Reiniciar todos los servicios"
    echo "  logs         - Mostrar logs recientes"
    echo "  users        - Crear usuarios por defecto"
    echo "  credentials  - Mostrar credenciales de acceso"
    echo "  help         - Mostrar esta ayuda"
    echo
    echo "Ejemplos:"
    echo "  $0 status"
    echo "  $0 start"
    echo "  $0 credentials"
    echo "  $0 restart"
    echo
}

# Función principal
main() {
    case "${1:-help}" in
        "status")
            show_status
            ;;
        "start")
            start_all
            ;;
        "stop")
            stop_all
            ;;
        "restart")
            restart_all
            ;;
        "logs")
            show_logs
            ;;
        "users")
            create_default_users
            ;;
        "credentials")
            show_credentials
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"
