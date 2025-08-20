
"""
Script para instalar dependencias en el entorno virtual
"""

import subprocess
import sys
import os

def install_in_venv():
    """Instalar dependencias en el entorno virtual"""
    
    # Determinar la ruta del pip del entorno virtual
    if os.name == 'nt':  # Windows
        pip_path = os.path.join('.venv', 'Scripts', 'pip.exe')
        python_path = os.path.join('.venv', 'Scripts', 'python.exe')
    else:  # Linux/Mac
        pip_path = os.path.join('.venv', 'bin', 'pip')
        python_path = os.path.join('.venv', 'bin', 'python')
    
    # Lista de dependencias
    dependencies = [
        'fastapi==0.116.1',
        'uvicorn[standard]',
        'python-dotenv>=1.0.1',
        'pydantic==2.11.7',
        'lightspark==2.10.1',
        'qrcode==7.4.2',
        'pillow==10.2.0',
        'psycopg2-binary==2.9.9',
        'PyMySQL==1.1.1'
    ]
    
    print("Instalando dependencias en el entorno virtual...")
    
    for dep in dependencies:
        print(f"Instalando {dep}...")
        try:
            result = subprocess.run([
                python_path, '-m', 'pip', 'install', dep
            ], capture_output=True, text=True, check=True)
            print(f"  ✅ {dep} instalado exitosamente")
        except subprocess.CalledProcessError as e:
            print(f"  ❌ Error instalando {dep}: {e}")
            print(f"  Output: {e.stdout}")
            print(f"  Error: {e.stderr}")
    
    print("\n🎉 Instalación completada!")
    print("\nAhora puedes ejecutar:")
    print("uvicorn main:app --reload")

if __name__ == "__main__":
    install_in_venv()