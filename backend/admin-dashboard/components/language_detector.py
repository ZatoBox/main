import streamlit as st


def detect_user_language():
    """Detecta idioma baseado no país/preferência do usuário"""

    # Opção 1: Seletor manual
    if "language" not in st.session_state:
        st.session_state.language = "pt"

    # Sidebar para seleção de idioma
    with st.sidebar:
        st.session_state.language = st.selectbox(
            "🌍 Idioma / Language / Idioma",
            ["pt", "en", "es"],
            format_func=lambda x: {"pt": "🇧🇷 Português", "en": "🇺🇸 English", "es": "🇪🇸 Español"}[x],
            key="language_selector"
        )

    return st.session_state.language


def get_user_country():
    """Detecta país do usuário (opcional - requer biblioteca adicional)"""
    # Implementação com requests para detectar IP/país
    # return "BR", "US", "ES", etc.
    pass