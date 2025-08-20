#!/bin/bash

# Script para crear usuario administrador por defecto
# Este script crea las credenciales de login mencionadas en el README.md

echo "🔐 Creando usuarios por defecto para ZatoBox..."

# Conectar a la base de datos y crear usuarios por defecto
sudo -u postgres psql -d zatobox_csm_db << 'EOF'

-- Insertar usuario administrador
INSERT INTO users (email, password, full_name, role, phone, address, created_at) 
VALUES 
    ('admin@frontposw.com', 'admin12345678', 'Administrator', 'admin', '+1234567890', 'Admin Address', NOW()),
    ('user@frontposw.com', 'user12345678', 'Regular User', 'user', '+0987654321', 'User Address', NOW())
ON CONFLICT (email) DO NOTHING;

-- Verificar que se crearon los usuarios
SELECT email, full_name, role FROM users;

EOF

echo "✅ Usuarios creados exitosamente!"
echo ""
echo "📋 Credenciales de acceso:"
echo "👨‍💼 Administrador:"
echo "   Email: admin@frontposw.com"
echo "   Password: admin12345678"
echo ""
echo "👤 Usuario regular:"
echo "   Email: user@frontposw.com" 
echo "   Password: user12345678"
echo ""
echo "🌐 Puedes acceder en: http://localhost:5173"
