page == "Configurações":
        st.header("⚙️ Configurações do Sistema")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("🔌 Status da API")

            if st.button("🔍 Verificar Conexão"):
                try:
                    response = requests.get(f"{API_BASE}/auth/users", headers=get_headers())
                    if response.status_code == 200:
                        st.success("✅ API conectada e funcionando")
                    elif response.status_code == 403:
                        st.warning("⚠️ API conectada, mas sem permissões adequadas")
                    else:
                        st.error(f"❌ API retornou status: {response.status_code}")
                except requests.exceptions.ConnectionError:
                    st.error("❌ Não foi possível conectar à API")
                except Exception as e:
                    st.error(f"❌ Erro: {str(e)}")

        with col2:
            st.subheader("👤 Informações da Conta")
            st.write(f"**Nome:** {st.session_state.user_info.get('fullName')}")
            st.write(f"**Email:** {st.session_state.user_info.get('email')}")
            st.write(f"**Função:** {st.session_state.user_info.get('role', 'user').title()}")

        st.markdown("---")
        st.subheader("🔧 Configurações Técnicas")
        st.code(f"API Base URL: {API_BASE}")
        st.info("💡 Para alterar configurações, edite o arquivo dashboard.py")