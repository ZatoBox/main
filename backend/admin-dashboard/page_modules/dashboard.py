import streamlit as st
import requests
from config import API_BASE

# Tranlation implementation
from translations import get_text
from components.language_detector import detect_user_language

from components.layout import Layout

class DashboardPage:
    page = Layout.show_sidebar()
    lang = detect_user_language()

    if page == "Dashboard":
        st.header(f"📊 {get_text("dashboard_main")}")

        # Métricas principais
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric(f"👥 {get_text("total_users", lang)}", "---", f"{get_text("loading", lang)}...")

        with col2:
            st.metric(f"📦 {get_text("total_products", lang)}", "---", f"{get_text("early", lang)}")

        with col3:
            st.metric(f"🛒 {get_text("request_today", lang)}", "---", f"{get_text("early", lang)}")

        with col4:
            st.metric(f"💰 {get_text("revenue", lang)}", f"{get_text("currency", lang)} ---", f"{get_text("early", lang)}")

        # Tentar carregar dados reais
        try:
            response = requests.get(f"{API_BASE}/auth/users", headers=Layout.show_headers())
            if response.status_code == 200:
                users_data = response.json().get("users", [])
                col1.metric(f"👥 {get_text("total_users", lang)}", len(users_data), f"+{len(users_data)} total")
        except:
            pass

        st.markdown("---")

        # Gráficos e informações adicionais
        st.subheader(f"📈 {get_text("recent_activity", lang)}")
        st.info(f"🚧 {get_text("info_grafic_more", lang)}")