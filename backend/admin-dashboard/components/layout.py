import streamlit as st
from translations import get_text
# from components.language_detector import detect_user_language
from config import LANGUAGE_BASE

from auth.session import AuthSession
from components.base_pages import PageSelector

class Layout:
    lang = LANGUAGE_BASE

    @staticmethod
    def show_header():
        # Header com informações do usuário
        col1, col2, col3 = st.columns([2, 1, 1])

        with col1:
            st.title("🔧 Zatobox Admin Dashboard")

        with col2:
            st.write(f"👤 **{st.session_state.user_info.get('fullname', 'Usuário')}**")
            st.write(
                f"🏷️ {get_text("administrator", Layout.lang) if st.session_state.user_info.get('role') == 'is_admin' else get_text("user", Layout.lang)}")

        with col3:
            if st.button(f"🚪 {get_text("logout", Layout.lang)}", use_container_width=True):
                AuthSession.logout_user()

        st.markdown("---")

    @staticmethod
    def show_sidebar():
        st.sidebar.title("📋 Menu")
        st.sidebar.write(f"Logado como: **{st.session_state.user_info.get('fullname')}**")
        st.sidebar.markdown("---")
        page_options = [v for v in PageSelector.get_page_options(Layout.lang).keys()]

        page = st.sidebar.selectbox("Escolha uma seção:",
                                    page_options,
                                    key="main_navigation")
        return page