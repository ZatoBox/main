import streamlit as st
import requests
from config import API_BASE

# Tranlation implementation
from translations import get_text
from components.language_detector import detect_user_language

from components.layout import Layout

class UsersPage:
    page == "Usuários":
    st.header("👥 Gerenciamento de Usuários")

    tab1, tab2, tab3 = st.tabs(["📋 Lista", "➕ Criar", "✏️ Editar"])

    with tab1:
        st.subheader("Lista de Usuários")

        if st.button("🔄 Atualizar Lista"):
            try:
                response = requests.get(f"{API_BASE}/auth/users", headers=get_headers())

                if response.status_code == 200:
                    data = response.json()
                    if data.get("users"):
                        df = pd.DataFrame(data["users"])

                        # Remover campos sensíveis se existirem
                        sensitive_fields = ['password', 'token']
                        for field in sensitive_fields:
                            if field in df.columns:
                                df = df.drop(columns=[field])

                        st.dataframe(df, use_container_width=True)

                        # Download CSV
                        csv = df.to_csv(index=False)
                        st.download_button(
                            label="📥 Download CSV",
                            data=csv,
                            file_name="usuarios.csv",
                            mime="text/csv"
                        )
                    else:
                        st.info("ℹ️ Nenhum usuário encontrado")
                else:
                    st.error(f"❌ Erro: {response.json().get('detail', 'Erro ao buscar usuários')}")

            except Exception as e:
                st.error(f"❌ Erro: {str(e)}")

    with tab2:
        st.subheader("Criar Novo Usuário")

        with st.form("create_user_form"):
            col1, col2 = st.columns(2)

            with col1:
                firstName = st.text_input("Nome *")
                email = st.text_input("Email *")

            with col2:
                lastName = st.text_input("Sobrenome *")
                phone = st.text_input("Telefone")

            password = st.text_input("Senha *", type="password")

            if st.form_submit_button("➕ Criar Usuário"):
                if firstName and lastName and email and password:
                    try:
                        response = requests.post(
                            f"{API_BASE}/auth/register",
                            data={
                                "firstName": firstName,
                                "lastName": lastName,
                                "email": email,
                                "password": password,
                                "phone": phone if phone else None
                            }
                        )

                        if response.status_code == 200:
                            st.success("✅ Usuário criado com sucesso!")
                            st.json(response.json())
                        else:
                            st.error(f"❌ Erro: {response.json().get('detail', 'Erro desconhecido')}")

                    except Exception as e:
                        st.error(f"❌ Erro: {str(e)}")
                else:
                    st.error("❌ Preencha todos os campos obrigatórios (*)")

    with tab3:
        st.subheader("Editar Usuário")

        user_id = st.number_input("ID do Usuário", min_value=1, step=1)

        if st.button("🔍 Buscar Usuário"):
            try:
                response = requests.get(f"{API_BASE}/auth/profile/{user_id}")

                if response.status_code == 200:
                    user_data = response.json().get("user", {})
                    st.session_state.edit_user_data = user_data
                    st.success("✅ Usuário encontrado!")
                else:
                    st.error("❌ Usuário não encontrado")

            except Exception as e:
                st.error(f"❌ Erro: {str(e)}")

        if hasattr(st.session_state, 'edit_user_data'):
            user = st.session_state.edit_user_data

            with st.form("edit_user_form"):
                col1, col2 = st.columns(2)

                with col1:
                    new_firstName = st.text_input("Nome", value=user.get("firstName", ""))
                    new_phone = st.text_input("Telefone", value=user.get("phone", ""))

                with col2:
                    new_lastName = st.text_input("Sobrenome", value=user.get("lastName", ""))
                    new_address = st.text_input("Endereço", value=user.get("address", ""))

                if st.form_submit_button("💾 Salvar Alterações"):
                    updates = {
                        "firstName": new_firstName,
                        "lastName": new_lastName,
                        "phone": new_phone,
                        "address": new_address
                    }

                    try:
                        response = requests.put(
                            f"{API_BASE}/auth/profile/{user_id}",
                            json=updates,
                            headers=get_headers()
                        )

                        if response.status_code == 200:
                            st.success("✅ Usuário atualizado com sucesso!")
                            st.json(response.json())
                        else:
                            st.error(f"❌ Erro: {response.json().get('detail', 'Erro ao atualizar')}")

                    except Exception as e:
                        st.error(f"❌ Erro: {str(e)}")