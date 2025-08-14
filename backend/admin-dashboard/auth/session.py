import streamlit as st
import requests
from config import API_BASE, LANGUAGE_BASE
from translations import get_text
from components.language_detector import detect_user_language

class AuthSession:
    lang = LANGUAGE_BASE

    # Inicializar session state
    @staticmethod
    def init_session_state():
        if "logged_in" not in st.session_state:
            st.session_state.logged_in = False
        if "user_token" not in st.session_state:
            st.session_state.user_token = None
        if "user_info" not in st.session_state:
            st.session_state.user_info = None

    @staticmethod
    def login_user(email, password):

        """Função para fazer login na API"""
        try:
            response = requests.post(
                f"{API_BASE}/auth/login",
                data={"email": email, "password": password}
            )

            if response.status_code == 200:
                data = response.json()
                user = data.get('user')

                if user.get("role") != 'is_admin':
                    return False, f"❌ {get_text("failed_access", AuthSession.lang)}"

                st.session_state.logged_in = True
                st.session_state.user_token = data.get("token")
                st.session_state.user_info = data.get("user")
                return True, get_text("login_success", AuthSession.lang)

            elif response.status_code == 401:
                error_msg = get_text("invalid_credentials")
                return False, error_msg

        except requests.exceptions.ConnectionError:
            return False, get_text("connection_error", AuthSession.lang)
        except Exception as e:
            return False, f"Erro inesperado: {str(e)}"

    @staticmethod
    def logout_user():
        """Função para fazer logout"""
        st.session_state.logged_in = False
        st.session_state.user_token = None
        st.session_state.user_info = None
        st.rerun()

    @staticmethod
    def get_headers():
        """Retorna headers com token de autenticação"""
        return {"Authorization": f"Bearer {st.session_state.user_token}"}