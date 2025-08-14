page == "Relatórios":
        st.header("📊 Relatórios e Análises")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("📈 Usuários")
            st.info("🚧 Relatórios de usuários em desenvolvimento")

        with col2:
            st.subheader("📦 Produtos")
            st.info("🚧 Relatórios de produtos em desenvolvimento")

        st.markdown("---")
        st.subheader("📋 Exportar Dados")

        if st.button("📥 Exportar Usuários"):
            try:
                response = requests.get(f"{API_BASE}/auth/users", headers=get_headers())
                if response.status_code == 200:
                    data = response.json().get("users", [])
                    df = pd.DataFrame(data)
                    csv = df.to_csv(index=False)
                    st.download_button(
                        label="💾 Download Usuários CSV",
                        data=csv,
                        file_name="relatorio_usuarios.csv",
                        mime="text/csv"
                    )
                else:
                    st.error("Erro ao buscar dados")
            except Exception as e:
                st.error(f"Erro: {str(e)}")