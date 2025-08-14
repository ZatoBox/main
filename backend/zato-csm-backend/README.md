# CSM API - Customer Service Management

**API REST Headless para integração com Zatobox PDV**

## 🚀 Como Executar

### Pré-requisitos
- Python 3.8+
- PostgreSQL ou MySQL
- Ambiente virtual ativado

### Instalação
```bash
# 1. Ativar ambiente virtual
.venv\Scripts\activate

# 2. Instalar dependências
pip install fastapi uvicorn python-multipart PyJWT psycopg2-binary pymysql

# 3. Configurar PYTHONPATH
$env:PYTHONPATH = "C:\caminho\para\zato-csm-backend"

# 4. Executar
python -m uvicorn main:app --reload
```

### Acessar
- **API:** http://localhost:8000
- **Documentação:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 📁 Estrutura do Projeto

```
backend/
├── main.py                 # Entry point da aplicação
├── config/
│   ├── database.py         # Configurações de banco (MySQL/PostgreSQL)
│   └── settings.py         # Configurações JWT e variáveis
├── models/                 # Schemas Pydantic
│   ├── user.py            # Modelo de usuário
│   └── product.py         # Modelo de produto
├── repositories/           # Camada de acesso a dados
│   ├── base_repository.py  # Classe base para repositories
│   ├── user_repositories.py # CRUD usuários
│   └── product_repositories.py # CRUD produtos
├── services/              # Lógica de negócio
│   ├── auth_service.py    # Autenticação e JWT
│   └── product_service.py # Lógica de produtos
├── routes/                # Endpoints da API
│   ├── auth.py            # Login/Register
│   ├── products.py        # CRUD produtos
│   └── sales.py           # Vendas
├── utils/                 # Utilitários
│   └── dependencies.py    # Dependencies compartilhadas
└── uploads/               # Arquivos de upload
    └── products/          # Imagens de produtos
```

## 🔧 Configuração

### Banco de Dados
Edite `config/settings.py` para alterar o banco padrão:
```python
DATABASE_TYPE = "postgres"  # ou "mysql"
```

### Configurações JWT
```python
SECRET_KEY = "your_jwt_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
```

## 📋 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Cadastro de usuário

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (com upload de imagens)
- `GET /api/products/{id}` - Buscar produto por ID
- `PUT /api/products/{id}` - Atualizar produto (parcial)
- `DELETE /api/products/{id}` - Deletar produto

## 🔐 Autenticação

Todos os endpoints (exceto login/register) requerem autenticação JWT:

```javascript
// 1. Fazer login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: formData // email, password
});
const { token } = await response.json();

// 2. Usar token nas requisições
fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🏗️ Arquitetura

### Padrão de Camadas
```
HTTP Request → Route → Service → Repository → Database
HTTP Response ← Route ← Service ← Repository ← Database
```

### Responsabilidades
- **Routes:** Recebem requisições HTTP e validam parâmetros
- **Services:** Contêm lógica de negócio e validações
- **Repositories:** Executam queries SQL e gerenciam dados
- **Config:** Configurações de banco e aplicação

## 🔄 Multi-Database

Suporta MySQL e PostgreSQL automaticamente:
- Configuração dinâmica via `settings.py`
- Queries otimizadas para cada banco
- Troca de banco sem alterar código

## 📦 Para Desenvolvedores

### Adicionando Novos Endpoints
1. Criar método no Repository (SQL)
2. Criar método no Service (lógica de negócio)
3. Criar endpoint na Route (HTTP)

### Exemplo
```python
# 1. Repository
def find_by_status(self, status: str):
    with self._get_cursor() as cursor:
        cursor.execute("SELECT * FROM products WHERE status=%s", (status,))
        return cursor.fetchall()

# 2. Service
def get_active_products(self):
    return self.product_repo.find_by_status('active')

# 3. Route
@router.get("/active")
def get_active_products(product_service=Depends(_get_product_service)):
    products = product_service.get_active_products()
    return {"products": products}
```

## 🚀 Deploy

### Produção
```bash
# Usar Gunicorn para produção
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

**Desenvolvido para integração com Zatobox PDV** 🛒

## ✅ Status do Projeto
- [x] Autenticação JWT
- [x] CRUD Produtos com upload de imagens
- [x] Multi-database (MySQL/PostgreSQL)
- [x] Documentação automática (Swagger)
- [x] Arquitetura modular
- [ ] Testes unitários
- [ ] Deploy automatizado

## 🔧 Troubleshooting

### Erro de Banco de Dados
Verifique as configurações em `config/database.py`:
- Host, usuário e senha corretos
- Banco de dados criado
- Dependências instaladas (psycopg2-binary ou pymysql)

### Erro de Import
Se encontrar erros de import, configure o PYTHONPATH:
```
# Windows PowerShell
$env:PYTHONPATH = "C:\caminho\para\zato-csm-backend"

# Windows CMD
set PYTHONPATH=C:\caminho\para\ zato-csm-backend
```

## 💡 Exemplos de Uso

### Criar Produto
```
curl -X POST "http://localhost:8000/api/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Produto Teste" \
  -F "description=Descrição do produto" \
  -F "price=29.99" \
  -F "stock=100" \
  -F "category=Eletrônicos" \
  -F "images=@produto.jpg"
```

## Atualizar Produto
```
curl -X PUT "http://localhost:8000/api/products/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 19.99, "stock": 50}'
```

## 🤝 Contribuição
**Para Desenvolvedores da Equipe**
1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça suas alterações seguindo a arquitetura existente
4. Teste localmente
5. Faça commit: `git commit -m "feat: adicionar nova funcionalidade"`
6. Push: `git push origin feature/nova-funcionalidade`
7. Abra um Pull Request
