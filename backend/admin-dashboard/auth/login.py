import streamlit as st

# Tranlation implementation
from translations import get_text
from config import LANGUAGE_BASE
from auth.session import AuthSession

class AuthLogin:
    @staticmethod
    def show_login_page():
        # Detection language
        lang = LANGUAGE_BASE

        # TELA DE LOGIN
        if not st.session_state.logged_in:
            st.title(f"🔐 {get_text("login_title", lang)}")
            st.markdown("---")

            # Centralizar o formulário de login
            col1, col2, col3 = st.columns([1, 2, 1])

            with col2:
                st.subheader(get_text("system_access", lang))

                with st.form("login_form"):
                    email = st.text_input(get_text("email", lang), placeholder="admin@zatobox.com")
                    password = st.text_input(get_text("password", lang), type="password", placeholder=get_text("your_password", lang))

                    login_button = st.form_submit_button(get_text('enter_button', lang), use_container_width=True)

                    if login_button:
                        if email and password:
                            success, message = AuthSession.login_user(email, password)

                            if success:
                                st.success(get_text("login_success", lang))
                                st.rerun()
                            else:
                                st.error(message)
                        else:
                            st.error(get_text("fill_fields", lang))

                # Informações de teste
                st.markdown("---")
                st.info(get_text("test_info", lang))
