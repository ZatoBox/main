#!/bin/bash

# Script para actualizar usuarios con contraseñas hasheadas
echo "🔐 Actualizando usuarios con contraseñas hasheadas..."

cd /home/omarqv/ZatoBox-Project/main/backend/zato-csm-backend

# Activar entorno virtual y ejecutar script Python
source venv/bin/activate

python3 << 'EOF'
import sys
import os
sys.path.append('/home/omarqv/ZatoBox-Project/main/backend/zato-csm-backend')

from config.database import connect_postgres
from utils.password_utils import hash_password

def update_user_passwords():
    conn = None
    cursor = None
    try:
        # Conectar a la base de datos
        conn = connect_postgres()
        cursor = conn.cursor()

        # Hashear contraseñas
        admin_password = hash_password("admin12345678")
        user_password = hash_password("user12345678")

        # Eliminar usuarios existentes para evitar duplicados
        cursor.execute("DELETE FROM users WHERE email IN ('admin@frontposw.com', 'user@frontposw.com')")

        # Insertar usuarios con contraseñas hasheadas
        cursor.execute("""
            INSERT INTO users (email, password, full_name, role, phone, address, created_at) 
            VALUES 
                (%s, %s, 'Administrator', 'admin', '+1234567890', 'Admin Address', NOW()),
                (%s, %s, 'Regular User', 'user', '+0987654321', 'User Address', NOW())
        """, ('admin@frontposw.com', admin_password, 'user@frontposw.com', user_password))

        conn.commit()

        # Verificar usuarios creados
        cursor.execute("SELECT email, full_name, role FROM users")
        users = cursor.fetchall()
        
        print("✅ Usuarios actualizados con contraseñas hasheadas:")
        for user in users:
            print(f"   {user[1]} ({user[0]}) - Rol: {user[2]}")

    except Exception as e:
        print(f"❌ Error actualizando usuarios: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    update_user_passwords()
EOF

echo ""
echo "📋 Credenciales de acceso actualizadas:"
echo "👨‍💼 Administrador:"
echo "   Email: admin@frontposw.com"
echo "   Password: admin12345678"
echo ""
echo "👤 Usuario regular:"
echo "   Email: user@frontposw.com" 
echo "   Password: user12345678"
echo ""
echo "🌐 Puedes acceder en: http://localhost:5173"
