# Solves problems with relative paths on other packages

import sys
import os

# Adicionar o diretório backend ao Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Agora importar e executar
import uvicorn
from main import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)