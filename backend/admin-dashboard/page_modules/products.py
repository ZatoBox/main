page == "Produtos":
        st.header("📦 Gerenciamento de Produtos")

        tab1, tab2 = st.tabs(["📋 Lista", "➕ Criar"])

        with tab1:
            st.info("🚧 Lista de produtos será implementada quando a API estiver pronta")

        with tab2:
            st.subheader("Criar Novo Produto")

            with st.form("create_product_form"):
                col1, col2 = st.columns(2)

                with col1:
                    name = st.text_input("Nome do Produto *")
                    price = st.number_input("Preço *", min_value=0.0, step=0.01)
                    category = st.text_input("Categoria *")

                with col2:
                    stock = st.number_input("Estoque *", min_value=0, step=1)
                    description = st.text_area("Descrição")
                    images = st.file_uploader("Imagens", accept_multiple_files=True, type=['png', 'jpg', 'jpeg'])

                if st.form_submit_button("➕ Criar Produto"):
                    st.info("🚧 Funcionalidade será implementada quando a API de produtos estiver pronta")