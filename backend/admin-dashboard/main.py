import streamlit as st
import requests
import pandas as pd

from translations import get_text
# from components.language_detector import detect_user_language

from auth.session import AuthSession
from auth.login import AuthLogin
from components.layout import Layout
from config import LANGUAGE_BASE

from components.base_pages import PagesEnum, PageSelector

# Configuração da página
st.set_page_config(
    page_title="Zatobox Admin Dashboard",
    page_icon="🔧",
    layout="wide"
)

# Inicializando sessão
AuthSession.init_session_state()

lang = LANGUAGE_BASE

if not st.session_state.logged_in:
    AuthLogin.show_login_page()

else:
    Layout.show_header()

    page = Layout.show_sidebar()
    print(f"DEBUG: page from sidebar = {page}")

    pages_options = PageSelector.get_page_options(lang)
    print(f"DEBUG: pages_options keys = {list(pages_options.keys())}")

    page_enum = pages_options.get(page)
    print(f"DEBUG: page_enum = {page_enum}")

    if page_enum == PagesEnum.DASHBOARD:
        st.header(f"📊 {get_text("dashboard_main", lang)}")
        st.info(f"🚧 {get_text("develop_page", lang)}")
    elif page_enum == PagesEnum.USERS:
        st.header(f"👥 {get_text("users", lang)}")
        st.info(f"🚧 {get_text("develop_page", lang)}")
    elif page_enum == PagesEnum.PRODUCTS:
        st.header(f"📦 {get_text("product_management", lang)}")
        st.info(f"🚧 {get_text("develop_page", lang)}")
    elif page_enum == PagesEnum.REPORTS:
        st.header(f"📊 {get_text("report_analysis", lang)}")
        st.info(f"🚧 {get_text("develop_page", lang)}")
    elif page_enum == PagesEnum.SETTINGS:
        st.header(f"⚙️ {get_text("system_settings", lang)}")
        st.info(f"🚧 {get_text("develop_page", lang)}")


# Footer
st.markdown("---")
st.markdown(get_text("footer_slogan", lang))
