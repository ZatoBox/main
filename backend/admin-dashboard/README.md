# Zatobox Admin Dashboard

Dashboard administrativo modular para gerenciar dados da API Zatobox com autenticação e internacionalização.

## 🚀 Como executar

1. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

2. **Configurar API:**
```python
# config.py
API_BASE = "http://localhost:8000/api"
LANGUAGE_BASE = "pt"  # Idioma padrão
```

3. **Executar o dashboard:**
```bash
streamlit run main.py
```

4. **Acessar:** http://localhost:8501

## 📁 Arquitetura do projeto

```
admin-dashboard/
├── main.py                    # Ponto de entrada e roteamento
├── config.py                  # Configurações globais
├── auth/
│   ├── login.py              # Interface de login
│   └── session.py            # Gerenciamento de sessão e autenticação
├── components/
│   ├── layout.py             # Header, sidebar e layout base
│   ├── base_pages.py         # Enum e seletor de páginas
│   └── language_detector.py  # Detecção de idioma
├── page_modules/             # Módulos de páginas específicas
│   ├── dashboard.py          # Dashboard principal
│   ├── users.py              # Gerenciamento de usuários
│   ├── products.py           # Gerenciamento de produtos
│   ├── reports.py            # Relatórios e análises
│   └── settings.py           # Configurações do sistema
├── services/
│   └── api_client.py         # Cliente da API (futuro)
├── translations.py           # Sistema de tradução
└── requirements.txt
```

## 🔐 Autenticação

- **Acesso restrito:** Apenas usuários com role `is_admin`
- **Login seguro:** Integração com API backend
- **Sessão gerenciada:** Controle automático de estado
- **Logout:** Limpeza completa da sessão

## 🌍 Internacionalização

- **Suporte multi-idioma:** Português, Inglês, Espanhol
- **Tradução automática:** Interface completamente traduzida
- **Configurável:** Idioma padrão definido em `config.py`

## 📋 Funcionalidades

### ✅ Implementadas:
- **Autenticação completa** com verificação de admin
- **Layout responsivo** com header e sidebar
- **Sistema de navegação** com enum de páginas
- **Internacionalização** completa
- **Arquitetura modular** escalável

### 🚧 Em desenvolvimento:
- **Dashboard principal** com métricas
- **Gerenciamento de usuários** (CRUD)
- **Gerenciamento de produtos** (CRUD)
- **Relatórios e análises**
- **Configurações do sistema**

## ⚙️ Configuração

### Variáveis principais:
```python
# config.py
API_BASE = "http://localhost:8000/api"  # URL da API backend
LANGUAGE_BASE = "pt"                    # Idioma padrão (pt/en/es)
```

### Dependências:
- **Streamlit** - Interface web
- **Requests** - Comunicação com API
- **Pandas** - Manipulação de dados

## 🔧 Desenvolvimento

### Adicionar nova página:
1. Criar enum em `components/base_pages.py`
2. Implementar módulo em `page_modules/`
3. Adicionar roteamento em `main.py`
4. Configurar traduções

### Estrutura de classes:
- **Métodos estáticos** para componentes reutilizáveis
- **Separação de responsabilidades** clara
- **Padrão Enum** para navegação
- **Sistema de tradução** centralizado

## 📝 Notas técnicas

- **API Backend:** Deve estar rodando em `http://localhost:8000`
- **Autenticação:** Requer usuários com role `is_admin` no backend
- **Responsividade:** Layout otimizado para diferentes telas
- **Performance:** Componentes otimizados com cache de sessão