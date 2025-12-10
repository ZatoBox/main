import { Language } from '@/hooks/use-language';

export const translations = {
  es: {
    // Header
    nav: {
      features: 'Características',
      pricing: 'Precios',
      testimonials: 'Testimonios',
      tryFree: 'Enviar Feedback',
      navigation: 'Navegación',
    },

    // Language
    language: {
      english: 'EN',
      spanish: 'ES',
    },

    // Accessibility and Alt texts
    accessibility: {
      altTexts: {
        logo: 'Logo de Pointer',
        dashboard: 'Vista previa del dashboard',
        companyLogo: 'Logo de empresa',
        avatar: 'avatar',
        bentoImages: {
          inventory: 'Interfaz de Inventario en la Nube',
          ocr: 'Interfaz de Scanner OCR Inteligente',
          payments: 'Interfaz de Pagos Integrados',
          zatolink: 'Interfaz de Zatolink Tienda Online',
          bitcoin: 'Interfaz de Pago en Bitcoin',
          automation: 'Interfaz de Automatización WhatsApp',
        },
      },
      ariaLabels: {
        twitter: 'Twitter',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        toggleNav: 'Alternar menú de navegación',
        toggleSidebar: 'Alternar barra lateral',
        close: 'Cerrar',
        previousPage: 'Ir a la página anterior',
        nextPage: 'Ir a la página siguiente',
        previousSlide: 'Diapositiva anterior',
        nextSlide: 'Siguiente diapositiva',
        more: 'Más',
      },
    },

    // Hero Section
    hero: {
      title: 'Tu negocio, organizado y sin complicaciones.',
      subtitle:
        'Inventario digital + pagos fáciles con Stripe, PayPal y Mercado Pago. Todo en un solo lugar.',
      cta: 'Probar gratis',
    },

    // Bento Section
    bento: {
      title: 'Las herramientas que tu negocio realmente necesita',
      subtitle:
        'Desde el inventario hasta los pagos: todo conectado, simple y listo para usarse sin complicaciones técnicas.',
      cards: {
        inventory: {
          title: 'Inventario En La Nube',
          description:
            'Controla tu stock en tiempo real y evita pérdidas por quiebres o sobrecompras.',
        },
        ocr: {
          title: 'Scanner Inteligente OCR:',
          description:
            'Olvídate de cargar productos a mano: digitaliza tus facturas y actualiza tu inventario automáticamente en cuestión de segundos.',
        },
        payments: {
          title: 'Pagos Integrados',
          description:
            'Acepta tarjetas y transferencias con Stripe, PayPal y Mercado Pago.',
        },
        zatolink: {
          title: 'En Desarrollo: Zatolink Tu Tienda Online',
          description:
            'Crea un link de venta único y comparte tu catálogo en redes sociales en segundos.',
        },
        bitcoin: {
          title: 'En Desarrollo: Pago En Bitcoin',
          description:
            'Transacciona en Bitcoin para quienes quieran ir más allá.',
        },
        automation: {
          title: 'Próximamente: Módulos de automatización',
          description: 'Haz crecer tu negocio con menos esfuerzo.',
        },
      },
    },

    // Pricing Section
    pricing: {
      title: 'Planes pensados para tu negocio, sin complicaciones',
      subtitle:
        'Durante el período Beta, todos nuestros planes son gratuitos. Después se habilitarán los precios regulares.',
      popular: 'Popular',
      period: {
        tester: '/ 15 días',
        other: '/mes',
      },
      toggle: {
        annual: 'Anual',
        monthly: 'Mensual',
      },
      includes: 'Incluye:',
      plans: {
        tester: {
          name: 'Tester',
          description:
            'Perfecto para emprendedores que quieren probar Zatobox como solución.',
          features: [
            'Gestión básica de inventario',
            'Hasta 50 productos',
            'Pagos con Stripe, PayPal y Mercado Pago',
            'Tienda online simple con ZatoLink',
            '15 días gratis de prueba',
          ],
          buttonText: 'Empezar gratis',
        },
        starter: {
          name: 'Starter',
          description:
            'Ideal para PYMEs en crecimiento que necesitan más control y eficiencia. Gratuito durante el período Beta.',
          features: [
            'Todo del plan Tester',
            'Inventario ilimitado',
            'Soporte prioritario',
            'Acceso a las betas de cada módulo nuevo',
            'Se habilitará precio después del período Beta',
          ],
          buttonText: 'Unirme ahora',
        },
        enterprise: {
          name: 'Enterprise',
          description:
            'Próximamente: Soluciones completas para negocios medianos y grandes.',
          features: [
            'Soporte dedicado',
            'Entrenamiento inicial para el equipo',
            'Opción de pago anual con descuento',
            'Se habilitará precio después del período Beta',
          ],
          buttonText: 'Empezar gratis',
        },
      },
    },

    // Testimonials
    testimonials: {
      title: 'Historias reales de negocios como el tuyo',
      subtitle:
        'Conoce cómo emprendedores y PYMEs usan ZatoBox para organizar su inventario, cobrar más fácil y hacer crecer su negocio.',
      items: [
        {
          quote:
            'Antes llevaba mi stock en cuadernos y Excel, perdía ventas por errores. Con ZatoBox ahora controlo todo desde mi celular y me sobra tiempo para atender clientes.',
          name: 'Virginia López',
          company: 'Tienda de Accesorios',
        },
        {
          quote:
            'Manejar inventario me quitaba horas todos los días. Con ZatoBox lo reviso en segundos y puedo enfocarme en atender mejor a mis clientes.',
          name: 'Daniela Pérez',
          company: 'Ferretería Ramírez',
        },
        {
          quote:
            'Mis clientes ya no tienen que pedirme cuentas manuales. Cobro con Stripe y Mercado Pago desde el mismo sistema, y se nota la diferencia en la confianza que transmito.',
          name: 'Luis Andrade',
          company: 'Productos Naturales',
        },
        {
          quote:
            'Con la prueba gratuita de 15 días confirmé que funcionaba: ahora tengo mi inventario ordenado y no pierdo tiempo cuadrando papeles.',
          name: 'Carlos Herrera',
          company: 'Tienda Local',
        },
        {
          quote:
            'Pasar de las planillas al panel de ZatoBox fue como quitarme un peso de encima. Ahora puedo enfocarme en crecer, no en cuadrar números todos los días.',
          name: 'María González',
          company: 'Minimarket San José',
        },
        {
          quote:
            'ZatoLink me permitió abrir mi tienda online sin saber nada de tecnología. Ahora comparto mi catálogo en Instagram y recibo pedidos directo desde ahí.',
          name: 'Oscar Ramírez',
          company: 'Moda y Ropa',
        },
        {
          quote:
            'Con ZatoBox todo es más fácil: inventario, pagos y ventas en un solo lugar. Hoy siento que mi negocio compite de igual a igual con cadenas grandes.',
          name: 'Ana Torres',
          company: 'Tienda de Abarrotes',
        },
      ],
    },

    // FAQ
    faq: {
      title: 'Preguntas Frecuentes',
      subtitle:
        'Todo lo que necesitas saber sobre ZatoBox y cómo puede ayudarte a organizar tu inventario, cobrar más fácil y hacer crecer tu negocio.',
      questions: [
        {
          question: '¿Qué es ZatoBox y para quién es?',
          answer:
            'ZatoBox es una plataforma modular diseñada para emprendedores y PYMEs que quieren digitalizar su negocio sin complicaciones. Te permite organizar inventario, aceptar pagos digitales y vender en línea de manera simple.',
        },
        {
          question: '¿Necesito experiencia en tecnología para usarlo?',
          answer:
            'No. ZatoBox está hecho para ser intuitivo. Puedes empezar a usarlo desde tu celular o computadora en minutos, sin conocimientos técnicos previos.',
        },
        {
          question: '¿Puedo integrar mis pasarelas de pago?',
          answer:
            'Sí. ZatoBox soporta pagos con Stripe, PayPal y Mercado Pago. Además, pronto podrás aceptar Bitcoin.',
        },
        {
          question: '¿Qué incluye el plan gratis?',
          answer:
            'El plan Tester incluye gestión básica de inventario, hasta 50 productos, pagos con Stripe, PayPal y Mercado Pago, tienda online simple con ZatoLink y 15 días gratis de prueba. Es perfecto para emprendedores que quieren probar Zatobox como solución.',
        },
        {
          question: '¿Puedo manejar varias tiendas con ZatoBox?',
          answer:
            'No por el momento, pero se espera que pronto podamos hacerlo. Con el plan Starter podrás centralizar tu inventario y ventas de varias sucursales en un solo panel, con control en tiempo real.',
        },
        {
          question: '¿Mi información está segura en ZatoBox?',
          answer:
            'Sí. ZatoBox utiliza medidas modernas de seguridad y tu información siempre permanece bajo tu control. No se comparte ni se usa fuera de tu cuenta.',
        },
      ],
    },

    // CTA Section
    cta: {
      title: 'Vender y gestionar nunca fue tan fácil',
      subtitle:
        'Descubre cómo emprendedores y PYMEs organizan su inventario, cobran con pasarelas digitales y hacen crecer su negocio con ZatoBox.',
      button: 'Probar gratis por 15 días',
    },

    // Social Proof
    socialProof: {
      text: 'Acepta pagos fácilmente con nuestras pasarelas integradas',
    },

    // Footer
    footer: {
      description:
        'ZatoBox es la plataforma modular que ayuda a PYMEs y emprendedores a organizar inventario, aceptar pagos digitales y vender en línea de forma simple.',
      navigation: {
        title: 'Navegación',
        features: 'Características',
        pricing: 'Precios',
      },
      moreInfo: {
        title: 'Más Info',
        testimonials: 'Testimonios',
        faq: 'Preguntas Frecuentes',
      },
    },

    // Auth - Login
    auth: {
      login: {
        title: 'Bienvenido de nuevo 👋',
        description:
          'Hoy es un nuevo día. Es tu día. Tú lo moldeas.\nInicia sesión para empezar a gestionar tus proyectos.',
        welcomeTitle: 'Bienvenido a ZatoBox',
        welcomeDescription:
          'La solución completa para la gestión de inventario y ventas.',
        welcomeSubtext:
          'Comienza a gestionar tu negocio de forma eficiente hoy.',
        mobileDescription:
          'Inicia sesión para continuar gestionando tu inventario',
        emailPlaceholder: 'Ejemplo@email.com',
        passwordPlaceholder: 'al menos 8 caracteres',
        rememberMe: 'Recordarme',
        forgotPassword: '¿Olvidaste tu contraseña?',
        signIn: 'Iniciar sesión',
        signingIn: 'Iniciando sesión...',
        orContinueWith: 'O continuar con',
        noAccount: '¿No tienes una cuenta?',
        signUp: 'Regístrate',
        restrictedAccess: 'Acceso restringido. Requiere plan Premium. Ve a',
        upgrade: 'mejorar',
        toUpgradePlan: 'para mejorar tu plan.',
        errorLoggingIn: 'Error al iniciar sesión',
      },
      register: {
        title: 'Crear cuenta',
        description: 'Regístrate para empezar a gestionar tu inventario',
        fullNamePlaceholder: 'Tu nombre completo',
        emailPlaceholder: 'ejemplo@email.com',
        passwordPlaceholder: 'al menos 8 caracteres',
        confirmPasswordPlaceholder: 'confirma tu contraseña',
        phonePlaceholder: 'número de teléfono (opcional)',
        agreeToTerms: 'Acepto los',
        termsAndConditions: 'Términos y Condiciones',
        and: 'y',
        privacyPolicy: 'Política de Privacidad',
        createAccount: 'Crear cuenta',
        creatingAccount: 'Creando cuenta...',
        alreadyHaveAccount: '¿Ya tienes cuenta?',
        signIn: 'Inicia sesión',
      },
      validation: {
        invalidEmail: 'Email inválido',
        emailRequired: 'El email es requerido',
        passwordMin: 'La contraseña debe tener al menos 8 caracteres',
        passwordRequired: 'La contraseña es requerida',
        fullNameRequired: 'El nombre completo es requerido',
        passwordsMustMatch: 'Las contraseñas deben coincidir',
        confirmPassword: 'Por favor confirma tu contraseña',
        acceptTerms: 'Debes aceptar los Términos y Condiciones',
      },
    },

    // Home
    home: {
      loading: 'Cargando productos...',
      polarSetup: {
        title: '¡Bienvenido a ZatoBox!',
        subtitle:
          'Para comenzar a gestionar tus productos e inventario, por favor configura tus credenciales de API de Polar en la configuración de tu perfil.',
      },
      errors: {
        reloadProducts: 'Error al recargar productos',
        checkoutLogin: 'Por favor inicia sesión para realizar el pago',
        createInvoice:
          'Error al crear el invoice de Bitcoin. Por favor intenta de nuevo.',
        checkoutFailed:
          'Fallo al crear el checkout. Por favor intenta de nuevo.',
      },
      wallet: {
        notConfigured: '⚠️ Wallet no configurada',
        configureXpub:
          'Para recibir pagos en Bitcoin, debes configurar tu XPUB en tu perfil.',
        goToProfile: 'Ir a perfil →',
      },
      pagination: {
        page: 'Página',
        of: '/',
      },
      retry: 'Reintentar',
      header: {
        title: 'Dashboard de Ventas',
        breadcrumbHome: 'Inicio',
        breadcrumbDashboard: 'Dashboard',
        description: 'Resumen de rendimiento y catálogo de productos',
        searchPlaceholder: 'Buscar productos...',
        skuSearch: 'Búsqueda rápida SKU',
        refreshProducts: 'Actualizar productos',
        viewCart: 'Ver carrito (Ctrl+K)',
      },
      stats: {
        showingResults: 'Mostrando',
        resultsFor: 'resultados para',
        selectProducts:
          'Selecciona productos para crear pedidos de venta rápidamente',
      },
      productCard: {
        outOfStock: 'Sin stock',
        inStock: 'en stock',
        unlimited: 'Ilimitado',
        available: 'disponibles',
        addToCart: 'Agregar',
        added: '¡Agregado!',
      },
    },

    // Inventory
    inventory: {
      loading: 'Cargando productos...',
      loginRequired: 'Debes iniciar sesión para ver el inventario',
      errors: {
        loadError: 'Error al cargar inventario',
        deleteError: 'Error al eliminar producto',
        unknownError: 'Error desconocido',
      },
      toast: {
        productDeleted: 'Producto eliminado',
        productDeletedDesc: 'El producto se eliminó correctamente.',
        productsDeleted: 'Productos eliminados',
        productsDeletedDesc: 'producto(s) eliminado(s) correctamente.',
        someNotDeleted: 'Algunos productos no se eliminaron',
        someNotDeletedDesc: 'producto(s) no pudieron eliminarse.',
        statusUpdated: 'Estado actualizado',
        statusUpdatedDesc: 'productos actualizados correctamente.',
        someNotUpdated: 'Algunos productos no se actualizaron',
        someNotUpdatedDesc: 'productos no pudieron actualizarse.',
        deleteError: 'Error al eliminar',
        deleteErrorDesc: 'No se pudieron eliminar los productos seleccionados.',
        updateError: 'Error al actualizar',
        updateErrorDesc:
          'No se pudieron actualizar los productos seleccionados.',
      },
      noCategory: 'Sin categoría',
      retry: 'Reintentar',
      dismiss: 'Descartar',
      noItemsFound: 'No se encontraron elementos',
      noItemsHint: 'Intenta ajustar los filtros o crear un nuevo elemento.',
      header: {
        title: 'Inventario',
        breadcrumbTools: 'Herramientas',
        breadcrumbInventory: 'Inventario',
        description: 'Gestiona tus productos y niveles de stock',
        searchPlaceholder: 'Buscar productos...',
        addProduct: 'Añadir producto',
      },
      filters: {
        allCategories: 'Todas las categorías',
        allStatuses: 'Todos los estados',
        active: 'Activo',
        inactive: 'Inactivo',
        selected: 'seleccionado(s)',
        deleteSelected: 'Eliminar',
        enableSelected: 'Habilitar',
        disableSelected: 'Deshabilitar',
      },
      jsonImporter: {
        title: 'Importador JSON Rápido',
        description:
          'Pega tu código JSON aquí para crear múltiples productos a la vez. Sigue la estructura requerida.',
        placeholder: 'Pega tu lista de productos en formato JSON aquí...',
        validate: 'Validar JSON',
        cancel: 'Cancelar',
        create: 'Crear Productos',
        creating: 'Creando...',
        success: '¡Productos creados exitosamente!',
        validationError: 'JSON inválido, revisa la sintaxis.',
        structureError:
          'Estructura inválida. Asegúrate de usar el formato correcto.',
        previewTitle: 'Vista Previa de Productos',
        detectedItems: 'ítems detectados',
        status: {
          valid: 'Válido',
          invalid: 'Inválido',
        },
        headers: {
          name: 'Nombre',
          price: 'Precio',
          stock: 'Stock',
          status: 'Estado',
        },
        example: 'Ver ejemplo',
        copyExample: 'Copiar ejemplo',
        exampleCopied: '¡Copiado!',
      },
      card: {
        outOfStock: 'Sin stock',
        unlimited: 'Ilimitado',
        units: 'unidades',
        active: 'Activo',
        inactive: 'Inactivo',
        edit: 'Editar',
        delete: 'Eliminar',
      },
      deleteModal: {
        title: '¿Eliminar producto?',
        description:
          'Esta acción no se puede deshacer. El producto será eliminado permanentemente.',
        cancel: 'Cancelar',
        confirm: 'Eliminar',
      },
      table: {
        image: 'Imagen',
        item: 'Artículo',
        category: 'Categoría',
        stock: 'Stock',
        price: 'Precio',
        selectAll: 'Seleccionar todo',
        selected: 'seleccionado',
      },
    },
    receipts: {
      card: {
        order: 'Pedido',
        items: 'artículos',
        viewReceipt: 'Ver recibo',
        print: 'Imprimir',
      },
      filters: {
        searchPlaceholder: 'Buscar recibos...',
        allStatuses: 'Todos',
        completed: 'Completados',
        pending: 'Pendientes',
        cancelled: 'Cancelados',
        failed: 'Fallido',
      },
      empty: {
        title: 'No hay recibos',
        description: 'Aún no tienes recibos registrados',
      },
      detail: {
        receipt: 'Recibo',
        items: 'Artículos',
        total: 'Total',
        method: 'Método',
        status: 'Estado',
        cash: 'EFECTIVO',
        bitcoin: 'BITCOIN',
        completed: 'Completado',
        pending: 'Pendiente',
        cancelled: 'Cancelado',
        purchaseReceipt: 'Recibo de Compra',
        orderDetails: 'Detalles del pedido',
        subtotal: 'Subtotal',
        noDetails: 'No hay detalles disponibles',
        paymentMethod: 'Método de Pago',
        cashLabel: 'Efectivo',
        cryptoLabel: 'Criptomoneda',
        view: 'Ver',
        download: 'Descargar',
        refund: 'Reembolsar',
        errorUpdating: 'Error al actualizar el pedido',
        product: 'Producto',
      },
      grid: {
        loading: 'Cargando recibos...',
        noReceipts: 'No se encontraron recibos',
        noReceiptsDesc:
          'Los recibos de pago aparecerán aquí cuando realices transacciones.',
      },
      statsLabels: {
        totalReceipts: 'Recibos Totales',
        totalAmount: 'Monto Total',
        completed: 'Completados',
      },
      crypto: {
        title: 'Recibos de Criptomoneda',
        description:
          'Esta sección está habilitada pero aún no hay recibos de criptomoneda.',
        comingSoon: 'Próximamente',
      },
      printModal: {
        title: 'Vista Previa del Recibo',
        purchaseReceipt: 'RECIBO DE COMPRA',
        date: 'Fecha',
        status: 'Estado',
        product: 'Producto',
        quantity: 'Cantidad',
        unitPrice: 'Precio Unit.',
        total: 'Total',
        noItems: 'No hay artículos',
        thanks: 'Gracias por tu compra',
        close: 'Cerrar',
        download: 'Descargar',
        print: 'Imprimir',
      },
    },

    // Plugin Store
    pluginStore: {
      loading: 'Cargando tienda de plugins...',
      title: 'Tienda de Plugins',
      description: 'Explora y gestiona los módulos comerciales de ZatoBox',
      breadcrumb: {
        tools: 'Herramientas',
        plugins: 'Plugins',
      },
      searchPlaceholder: 'Buscar plugins...',
      status: {
        active: 'Activo',
        inactive: 'Inactivo',
        comingSoon: 'Próximamente',
        maintenance: 'Mantenimiento',
      },
      price: {
        free: 'Gratis',
        premium: 'Premium',
      },
      noPlugins: {
        title: 'No se encontraron plugins',
        description: 'Intenta ajustar tu búsqueda',
      },
      loginRequired: 'Por favor inicia sesión para gestionar plugins',
      buttons: {
        activate: 'Activar',
        deactivate: 'Desactivar',
        inDevelopment: 'En Desarrollo',
        inMaintenance: 'En Mantenimiento',
      },
      featured: {
        title: '🔥 MAYORES INSTALACIONES por Popularidad',
      },
      more: 'más',
    },

    // Restock
    restock: {
      breadcrumb: {
        inventory: 'Inventario',
        restock: 'Restock',
      },
      title: 'Reabastecer Inventario',
      description: 'Busca productos y agrega cantidades al stock',
      searchPlaceholder: 'Buscar por nombre o SKU...',
      loading: 'Cargando productos...',
      errors: {
        loginRequired: 'Debes iniciar sesión',
        loadProducts: 'Error cargando productos',
        selectProduct: 'Selecciona al menos un producto',
        enterQuantities: 'Ingresa cantidades a reabastecer',
        restockError: 'Error al reabastecer',
      },
      currentStock: 'Stock actual',
      units: 'unidades',
      noProducts: 'No hay productos',
      noProductsFound: 'No se encontraron productos',
      selected: 'Seleccionados',
      stock: 'Stock',
      quantityPlaceholder: 'Cantidad a agregar',
      selectToRestock: 'Selecciona productos para reabastecer',
      pagination: {
        previous: '← Anterior',
        next: 'Siguiente →',
        page: 'Página',
        of: 'de',
      },
      submit: {
        processing: 'Procesando...',
        confirm: 'Confirmar Restock',
      },
      success: '¡Reabastecimiento completado!',
    },

    // Profile
    profile: {
      loading: 'Cargando perfil...',
      saving: 'Guardando...',
      noChanges: 'No hay cambios para guardar',
      updateSuccess: 'Perfil actualizado correctamente',
      avatarSuccess: 'Avatar actualizado correctamente',
      errorEditing: 'Error editando perfil',
      success: '¡Éxito!',
      edit: 'Editar',
      cancel: 'Cancelar',
      save: 'Guardar',
      logout: 'Cerrar Sesión',
      configured: 'Configurado',
      notConfigured: 'No está configurado',
      notProvided: 'No proporcionado',
      noEmail: 'Sin correo electrónico',
      sections: {
        personalInfo: 'Información Personal',
        cryptoPayments: 'Pagos con Crypto',
        cryptoDescription:
          'Configura tu tienda BTCPay Server para recibir pagos en Bitcoin',
        account: 'Cuenta',
      },
      fields: {
        fullName: 'Nombre Completo',
        email: 'Correo Electrónico',
        phone: 'Número de Teléfono',
      },
      language: {
        title: 'Idioma',
        description: 'Selecciona tu idioma preferido',
        spanish: 'Español',
        english: 'English',
      },
    },

    // Wallet
    wallet: {
      loading: 'Cargando wallet...',
      retry: 'Reintentar',
      errors: {
        loadConfig: 'Error al cargar la configuración de la wallet',
        sendError: 'Error al enviar fondos',
        connectionError: 'Error de conexión',
      },
      header: {
        finance: 'Finanzas',
        wallet: 'Wallet',
        title: 'Tu Billetera',
        description: 'Gestiona tus fondos y realiza retiros seguros',
      },
      setup: {
        title: 'Configura tu Billetera Bitcoin',
        description:
          'Para comenzar a recibir y gestionar pagos en Bitcoin, necesitas activar tu billetera. Este proceso creará una wallet segura y única para tu tienda.',
        features: {
          segwit: 'Wallet SegWit',
          selfCustody: 'Custodia Propia',
          autoPayments: 'Pagos Automáticos',
        },
        button: 'Activar Wallet',
        securityNote:
          'Tus llaves privadas se generan localmente y solo tú tienes acceso a ellas.',
      },
      send: {
        title: 'Enviar Fondos',
        activeWallet: 'Wallet Activa',
        successTitle: '¡Transacción enviada con éxito!',
        successMessage: 'Tu transacción ha sido transmitida a la red.',
        totalBalance: 'Balance Total',
        destinationLabel: 'Dirección de Destino',
        amountLabel: 'Monto a Enviar',
        maxAmount: 'Dejar vacío para enviar el máximo disponible',
        subtractFees: 'Restar comisión del monto',
        cantSeeTransaction: '¿No ves tu transacción?',
        networkPriority: 'Prioridad de Red',
        priorities: {
          economic: 'Económica',
          standard: 'Estándar',
          fast: 'Rápida',
        },
        confirmButton: 'Confirmar Envío',
        processing: 'Procesando...',
      },
      helpModal: {
        title: '¿No ves tu transacción?',
        description:
          'Puede que necesites ajustar el gap limit, el starting index o el batch size en tu gestor de wallet para encontrar todas tus direcciones',
        needHelp: {
          title: '¿Necesitas ayuda?',
          description:
            'Si tienes problemas con el rescaneo o no ves tu transacción, nuestro equipo puede ayudarte.',
        },
        feedback: {
          title: 'Queremos tu opinión',
          description:
            'Estamos mejorando tu experiencia y tu opinión es clave ayúdanos a construir la próxima mejora',
          button: 'Dejar feedback',
        },
        done: 'Hecho',
      },
    },

    // Crypto Store Setup
    cryptoSetup: {
      loading: 'Cargando configuración...',
      errorLoading: 'Error al cargar la configuración',
      retry: 'Reintentar',
      title: 'Configura tu Store de Bitcoin',
      description:
        'Para comenzar a recibir pagos en Bitcoin, necesitas configurar tu tienda y crear una wallet. Este proceso es rápido y seguro.',
      whatIncludes: '¿Qué incluye?',
      features: {
        store: 'Creación de tu tienda personal en BTCPay',
        wallet: 'Generación de wallet hot con SegWit',
        recovery: '12 palabras de recuperación seguras',
        payments: 'Configuración automática de pagos',
      },
      setupButton: 'Termina de settear tu store',
      configured: {
        title: '✓ Store Configurada',
        description:
          'Tu tienda de Bitcoin está lista. Todos los pagos en crypto se procesarán automáticamente a través de tu wallet.',
      },
      delete: {
        button: 'Eliminar Store y Wallet',
        confirmTitle: '¿Estás seguro?',
        confirmDescription:
          'Esta acción eliminará tu tienda y tu wallet del servidor. Perderás el acceso a los fondos si no tienes tu frase de recuperación.',
        cancel: 'Cancelar',
        continue: 'Continuar',
        finalTitle: '¡Confirmación Final!',
        finalDescription:
          'Esta acción es IRREVERSIBLE. Se borrarán todos los datos de tu tienda y wallet de nuestra base de datos y del servidor de pagos. ¿Confirmas que quieres eliminar todo permanentemente?',
        deleting: 'Eliminando...',
        confirmDelete: 'Sí, eliminar todo',
        error: 'Error al eliminar la store',
      },
    },

    // SideMenu
    sideMenu: {
      home: {
        name: 'Inicio',
        description: 'Página principal',
      },
      inventory: {
        name: 'Inventario',
        description: 'Gestionar inventario',
      },
      smartInventory: {
        name: 'Inventario Inteligente',
        description: 'AI para inventario',
      },
      ocr: {
        name: 'Documentos OCR',
        description: 'Procesar documentos',
      },
      pos: {
        name: 'Integración POS',
        description: 'Integración con sistemas POS',
      },
      receipts: {
        name: 'Recibos',
        description: 'Ver recibos de compra',
      },
      restock: {
        name: 'Restock',
        description: 'Reabastecer inventario',
      },
      wallet: {
        name: 'Wallet',
        description: 'Gestiona tus fondos',
      },
      pluginStore: {
        name: 'Tienda de Plugins',
        description: 'Buscar módulos',
      },
      profile: {
        name: 'Perfil',
        description: 'Gestionar cuenta',
      },
      feedback: {
        title: 'Queremos tu opinión',
        description:
          'Estamos mejorando tu experiencia y tu opinión es clave ayúdanos a construir la próxima mejora',
        button: 'Dejar feedback',
      },
    },

    newProduct: {
      title: 'Nuevo Producto',
      uploader: {
        title: 'Imágenes del Producto',
        dragDrop: 'Arrastra y suelta las imágenes aquí',
        clickSelect: 'o haz clic para seleccionar',
        maxFiles: 'Máximo 4 imágenes',
        formats: 'PNG, JPG, WEBP hasta 5MB',
      },
      labels: {
        name: 'Nombre del Producto',
        description: 'Descripción',
        price: 'Precio',
        stock: 'Stock',
        category: 'Categoría',
        sku: 'SKU',
        unlimitedStock: 'Stock Ilimitado',
      },
      validation: {
        nameRequired: 'El nombre es requerido',
        priceNumber: 'El precio debe ser un número',
        priceMin: 'El precio debe ser mayor o igual a 0',
        priceRequired: 'El precio es requerido',
        stockNumber: 'El stock debe ser un número',
        stockInteger: 'El stock debe ser un número entero',
        stockMin: 'El stock debe ser mayor o igual a 0',
        stockRequired: 'El stock es requerido',
      },
      buttons: {
        save: 'Guardar Producto',
        saving: 'Guardando...',
        cancel: 'Cancelar',
      },
    },

    editProduct: {
      title: 'Editar Producto',
      loading: 'Cargando producto...',
      notFound: 'Producto no encontrado',
      idRequired: 'ID de producto requerido',
      labels: {
        name: 'Nombre del Producto',
        description: 'Descripción',
        price: 'Precio',
        stock: 'Stock',
        category: 'Categoría',
        sku: 'SKU',
        unlimitedStock: 'Stock Ilimitado',
        currentImages: 'Imágenes Actuales',
      },
      errors: {
        loginRequired: 'Debes iniciar sesión para editar productos',
        uploadImages: 'Error al subir las imágenes',
        updateProduct: 'Error al actualizar el producto',
        updateStatus: 'Error al actualizar el estado',
        archiveProduct: 'Error al archivar el producto',
      },
      buttons: {
        save: 'Guardar Cambios',
        saving: 'Guardando...',
        back: 'Volver',
        archive: 'Archivar',
        activate: 'Activar',
        deactivate: 'Desactivar',
      },
      header: {
        title: 'Editar Producto',
        updating: 'Actualizando...',
        update: 'Actualizar',
        active: 'Activo',
        inactive: 'Inactivo',
        archive: 'Archivar',
        archiving: 'Archivando...',
      },
    },

    subscription: {
      cancelTitle: 'Cancelar Suscripción',
      cancelDescription: 'Para cancelar su suscripción, contáctese con:',
      supportEmail: 'support@zatobox.com',
    },
  },

  en: {
    // Header
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      tryFree: 'Send Feedback',
      navigation: 'Navigation',
    },

    // Language
    language: {
      english: 'EN',
      spanish: 'ES',
    },

    // Accessibility and Alt texts
    accessibility: {
      altTexts: {
        logo: 'Pointer Logo',
        dashboard: 'Dashboard preview',
        companyLogo: 'Company Logo',
        avatar: 'avatar',
        bentoImages: {
          inventory: 'Cloud Inventory Interface',
          ocr: 'Smart OCR Scanner Interface',
          payments: 'Integrated Payments Interface',
          zatolink: 'Zatolink Online Store Interface',
          bitcoin: 'Bitcoin Payment Interface',
          automation: 'WhatsApp Automation Interface',
        },
      },
      ariaLabels: {
        twitter: 'Twitter',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        toggleNav: 'Toggle navigation menu',
        toggleSidebar: 'Toggle Sidebar',
        close: 'Close',
        previousPage: 'Go to previous page',
        nextPage: 'Go to next page',
        previousSlide: 'Previous slide',
        nextSlide: 'Next slide',
        more: 'More',
      },
    },

    // Hero Section
    hero: {
      title: 'Your business, organized and hassle-free.',
      subtitle:
        'Digital inventory + easy payments with Stripe, PayPal and Mercado Pago. Everything in one place.',
      cta: 'Try free',
    },

    // Bento Section
    bento: {
      title: 'The tools your business really needs',
      subtitle:
        'From inventory to payments: everything connected, simple and ready to use without technical complications.',
      cards: {
        inventory: {
          title: 'Cloud Inventory',
          description:
            'Control your stock in real-time and avoid losses from stockouts or over-purchases.',
        },
        ocr: {
          title: 'Smart OCR Scanner:',
          description:
            'Forget about manually loading products: digitize your invoices and update your inventory automatically in seconds.',
        },
        payments: {
          title: 'Integrated Payments',
          description:
            'Accept cards and transfers with Stripe, PayPal and Mercado Pago.',
        },
        zatolink: {
          title: 'In Development: Zatolink Your Online Store',
          description:
            'Create a unique sales link and share your catalog on social media in seconds.',
        },
        bitcoin: {
          title: 'In Development: Bitcoin Payment',
          description: 'Transact in Bitcoin for those who want to go further.',
        },
        automation: {
          title: 'Coming Soon: Automation Modules',
          description: 'Grow your business with less effort.',
        },
      },
    },

    // Pricing Section
    pricing: {
      title: 'Plans designed for your business, without complications',
      subtitle:
        'During the Beta period, all our plans are free. Regular prices will be enabled later.',
      popular: 'Popular',
      period: {
        tester: '/ 15 days',
        other: '/month',
      },
      toggle: {
        annual: 'Annual',
        monthly: 'Monthly',
      },
      includes: 'Includes:',
      plans: {
        tester: {
          name: 'Tester',
          description:
            'Perfect for entrepreneurs who want to try Zatobox as a solution.',
          features: [
            'Basic inventory management',
            'Up to 50 products',
            'Payments with Stripe, PayPal and Mercado Pago',
            'Simple online store with ZatoLink',
            '15 days free trial',
          ],
          buttonText: 'Start free',
        },
        starter: {
          name: 'Starter',
          description:
            'Ideal for growing SMEs that need more control and efficiency. Free during the Beta period.',
          features: [
            'Everything from Tester plan',
            'Unlimited inventory',
            'Priority support',
            'Access to betas of each new module',
            'Price will be enabled after Beta period',
          ],
          buttonText: 'Join now',
        },
        enterprise: {
          name: 'Enterprise',
          description:
            'Coming Soon: Complete solutions for medium and large businesses.',
          features: [
            'Dedicated support',
            'Initial team training',
            'Annual payment option with discount',
            'Price will be enabled after Beta period',
          ],
          buttonText: 'Start free',
        },
      },
    },

    // Testimonials
    testimonials: {
      title: 'Real stories from businesses like yours',
      subtitle:
        'Learn how entrepreneurs and SMEs use ZatoBox to organize their inventory, collect payments more easily and grow their business.',
      items: [
        {
          quote:
            'Before I used to carry my stock in notebooks and Excel, I lost sales due to errors. With ZatoBox now I control everything from my phone and I have time left to attend to customers.',
          name: 'Virginia López',
          company: 'Accessories Store',
        },
        {
          quote:
            'Managing inventory took me hours every day. With ZatoBox I review it in seconds and can focus on better serving my customers.',
          name: 'Daniela Pérez',
          company: 'Ramírez Hardware Store',
        },
        {
          quote:
            'My customers no longer have to ask me for manual accounts. I collect with Stripe and Mercado Pago from the same system, and you can notice the difference in the confidence I transmit.',
          name: 'Luis Andrade',
          company: 'Natural Products',
        },
        {
          quote:
            "With the 15-day free trial I confirmed it worked: now I have my inventory organized and I don't waste time balancing papers.",
          name: 'Carlos Herrera',
          company: 'Local Store',
        },
        {
          quote:
            "Going from spreadsheets to ZatoBox's panel was like taking a weight off my shoulders. Now I can focus on growing, not balancing numbers every day.",
          name: 'María González',
          company: 'San José Minimarket',
        },
        {
          quote:
            'ZatoLink allowed me to open my online store without knowing anything about technology. Now I share my catalog on Instagram and receive orders directly from there.',
          name: 'Oscar Ramírez',
          company: 'Fashion and Clothing',
        },
        {
          quote:
            'With ZatoBox everything is easier: inventory, payments and sales in one place. Today I feel that my business competes on equal terms with large chains.',
          name: 'Ana Torres',
          company: 'Grocery Store',
        },
      ],
    },

    // FAQ
    faq: {
      title: 'Frequently Asked Questions',
      subtitle:
        'Everything you need to know about ZatoBox and how it can help you organize your inventory, collect payments more easily and grow your business.',
      questions: [
        {
          question: 'What is ZatoBox and who is it for?',
          answer:
            'ZatoBox is a modular platform designed for entrepreneurs and SMEs who want to digitize their business without complications. It allows you to organize inventory, accept digital payments and sell online in a simple way.',
        },
        {
          question: 'Do I need technology experience to use it?',
          answer:
            'No. ZatoBox is made to be intuitive. You can start using it from your phone or computer in minutes, without prior technical knowledge.',
        },
        {
          question: 'Can I integrate my payment gateways?',
          answer:
            "Yes. ZatoBox supports payments with Stripe, PayPal and Mercado Pago. Additionally, you'll soon be able to accept Bitcoin.",
        },
        {
          question: 'What does the free plan include?',
          answer:
            "The Tester plan includes basic inventory management, up to 50 products, payments with Stripe, PayPal and Mercado Pago, simple online store with ZatoLink and 15 days free trial. It's perfect for entrepreneurs who want to try Zatobox as a solution.",
        },
        {
          question: 'Can I manage multiple stores with ZatoBox?',
          answer:
            "Not at the moment, but we expect to be able to do so soon. With the Starter plan you'll be able to centralize your inventory and sales from multiple branches in a single panel, with real-time control.",
        },
        {
          question: 'Is my information safe in ZatoBox?',
          answer:
            'Yes. ZatoBox uses modern security measures and your information always remains under your control. It is not shared or used outside your account.',
        },
      ],
    },

    // CTA Section
    cta: {
      title: 'Selling and managing has never been so easy',
      subtitle:
        'Discover how entrepreneurs and SMEs organize their inventory, collect payments with digital gateways and grow their business with ZatoBox.',
      button: 'Try free for 15 days',
    },

    // Social Proof
    socialProof: {
      text: 'Accept payments easily with our integrated gateways',
    },

    // Footer
    footer: {
      description:
        'ZatoBox is the modular platform that helps SMEs and entrepreneurs organize inventory, accept digital payments and sell online in a simple way.',
      navigation: {
        title: 'Navigation',
        features: 'Features',
        pricing: 'Pricing',
      },
      moreInfo: {
        title: 'More Info',
        testimonials: 'Testimonials',
        faq: 'Frequently Asked Questions',
      },
    },

    // Auth - Login
    auth: {
      login: {
        title: 'Welcome Back 👋',
        description:
          "Today is a new day. It's your day. You shape it.\nSign in to start managing your projects.",
        welcomeTitle: 'Welcome to ZatoBox',
        welcomeDescription:
          'The complete solution for inventory and sales management.',
        welcomeSubtext: 'Start managing your business efficiently today.',
        mobileDescription: 'Sign in to continue managing your inventory',
        emailPlaceholder: 'Example@email.com',
        passwordPlaceholder: 'at least 8 characters',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        orContinueWith: 'Or continue with',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        restrictedAccess: 'Restricted access. Requires Premium plan. Go to',
        upgrade: 'upgrade',
        toUpgradePlan: 'to upgrade your plan.',
        errorLoggingIn: 'Error logging in',
      },
      register: {
        title: 'Create Account',
        description: 'Sign up to start managing your inventory',
        fullNamePlaceholder: 'Your full name',
        emailPlaceholder: 'example@email.com',
        passwordPlaceholder: 'at least 8 characters',
        confirmPasswordPlaceholder: 'confirm your password',
        phonePlaceholder: 'phone number (optional)',
        agreeToTerms: 'I agree to the',
        termsAndConditions: 'Terms and Conditions',
        and: 'and',
        privacyPolicy: 'Privacy Policy',
        createAccount: 'Create Account',
        creatingAccount: 'Creating account...',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign in',
      },
      validation: {
        invalidEmail: 'Invalid email',
        emailRequired: 'Email is required',
        passwordMin: 'Password must be at least 8 characters',
        passwordRequired: 'Password is required',
        fullNameRequired: 'Full name is required',
        passwordsMustMatch: 'Passwords must match',
        confirmPassword: 'Please confirm your password',
        acceptTerms: 'You must accept the Terms and Conditions',
      },
    },

    // Home
    home: {
      loading: 'Loading products...',
      polarSetup: {
        title: 'Welcome to ZatoBox!',
        subtitle:
          'To start managing your products and inventory, please configure your Polar API credentials in your profile settings.',
      },
      errors: {
        reloadProducts: 'Error reloading products',
        checkoutLogin: 'Please log in to checkout',
        createInvoice: 'Error creating Bitcoin invoice. Please try again.',
        checkoutFailed: 'Failed to create checkout. Please try again.',
      },
      wallet: {
        notConfigured: '⚠️ Wallet not configured',
        configureXpub:
          'To receive Bitcoin payments, you must configure your XPUB in your profile.',
        goToProfile: 'Go to profile →',
      },
      pagination: {
        page: 'Page',
        of: '/',
      },
      retry: 'Retry',
      header: {
        title: 'Sales Dashboard',
        breadcrumbHome: 'Home',
        breadcrumbDashboard: 'Dashboard',
        description: 'Performance summary and product catalog',
        searchPlaceholder: 'Search products...',
        skuSearch: 'Quick SKU search',
        refreshProducts: 'Refresh products',
        viewCart: 'View cart (Ctrl+K)',
      },
      stats: {
        showingResults: 'Showing',
        resultsFor: 'results for',
        selectProducts: 'Select products to quickly create sales orders',
      },
      productCard: {
        outOfStock: 'Out of stock',
        inStock: 'in stock',
        unlimited: 'Unlimited',
        available: 'available',
        addToCart: 'Add',
        added: 'Added!',
      },
    },

    // Inventory
    inventory: {
      loading: 'Loading products...',
      loginRequired: 'You must log in to view inventory',
      errors: {
        loadError: 'Error loading inventory',
        deleteError: 'Error deleting product',
        unknownError: 'Unknown error',
      },
      toast: {
        productDeleted: 'Product deleted',
        productDeletedDesc: 'The product was successfully deleted.',
        productsDeleted: 'Products deleted',
        productsDeletedDesc: 'product(s) successfully deleted.',
        someNotDeleted: 'Some products were not deleted',
        someNotDeletedDesc: 'product(s) could not be deleted.',
        statusUpdated: 'Status updated',
        statusUpdatedDesc: 'products successfully updated.',
        someNotUpdated: 'Some products were not updated',
        someNotUpdatedDesc: 'products could not be updated.',
        deleteError: 'Error deleting',
        deleteErrorDesc: 'The selected products could not be deleted.',
        updateError: 'Error updating',
        updateErrorDesc: 'The selected products could not be updated.',
      },
      noCategory: 'No category',
      retry: 'Retry',
      dismiss: 'Dismiss',
      noItemsFound: 'No items found',
      noItemsHint: 'Try adjusting the filters or creating a new item.',
      header: {
        title: 'Inventory',
        breadcrumbTools: 'Tools',
        breadcrumbInventory: 'Inventory',
        description: 'Manage your products and stock levels',
        searchPlaceholder: 'Search products...',
        addProduct: 'Add product',
      },
      filters: {
        allCategories: 'All categories',
        allStatuses: 'All statuses',
        active: 'Active',
        inactive: 'Inactive',
        selected: 'selected',
        deleteSelected: 'Delete',
        enableSelected: 'Enable',
        disableSelected: 'Disable',
      },
      card: {
        outOfStock: 'Out of stock',
        unlimited: 'Unlimited',
        units: 'units',
        active: 'Active',
        inactive: 'Inactive',
        edit: 'Edit',
        delete: 'Delete',
      },
      deleteModal: {
        title: 'Delete product?',
        description:
          'This action cannot be undone. The product will be permanently deleted.',
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      table: {
        image: 'Image',
        item: 'Item',
        category: 'Category',
        stock: 'Stock',
        price: 'Price',
        selectAll: 'Select all',
        selected: 'selected',
      },
      jsonImporter: {
        title: 'Quick JSON Importer',
        description:
          'Paste your JSON code here to create multiple products at once. Follow the required structure.',
        placeholder: 'Paste your product list in JSON format here...',
        validate: 'Validate JSON',
        cancel: 'Cancel',
        create: 'Create Products',
        creating: 'Creating...',
        success: 'Products created successfully!',
        validationError: 'Invalid JSON, check syntax.',
        structureError:
          'Invalid structure. Make sure to use the correct format.',
        previewTitle: 'Product Preview',
        detectedItems: 'detected items',
        status: {
          valid: 'Valid',
          invalid: 'Invalid',
        },
        headers: {
          name: 'Name',
          price: 'Price',
          stock: 'Stock',
          status: 'Status',
        },
        example: 'View Example',
        copyExample: 'Copy Example',
        exampleCopied: 'Copied!',
      },
    },

    // New Product
    newProduct: {
      errors: {
        loginRequired: 'You must log in to create products',
        uploadImages: 'Error uploading images',
        createProduct: 'Error creating product',
      },
      labels: {
        description: 'Description',
        category: 'Category',
        sku: 'SKU',
        name: 'Name *',
        price: 'Price *',
        stock: 'Stock *',
        unlimitedStock: 'Unlimited Stock',
      },
      validation: {
        nameRequired: 'Name is required',
        priceNumber: 'Price must be a number',
        priceMin: 'Price must be 0 or greater',
        priceRequired: 'Price is required',
        stockNumber: 'Stock must be a number',
        stockInteger: 'Stock must be a whole number',
        stockMin: 'Stock must be 0 or greater',
        stockRequired: 'Stock is required',
      },
      header: {
        title: 'New Product',
        saving: 'Saving...',
        save: 'Save',
      },
      uploader: {
        title: 'Product Images',
        dragDrop: 'Drag and drop images here',
        clickSelect: 'or click to select files',
      },
    },

    // Edit Product
    editProduct: {
      loading: 'Loading product...',
      notFound: 'Product not found',
      idRequired: 'Product ID is required',
      errors: {
        loginRequired: 'You must log in to update products',
        uploadImages: 'Error uploading images',
        updateProduct: 'Error updating product',
        updateStatus: 'Error updating product status',
        archiveProduct: 'Error archiving product',
      },
      labels: {
        currentImages: 'Current images',
        description: 'Description',
        category: 'Category',
        sku: 'SKU',
        name: 'Name *',
        price: 'Price *',
        stock: 'Stock *',
        unlimitedStock: 'Unlimited Stock',
      },
      header: {
        title: 'Edit Product',
        updating: 'Updating...',
        update: 'Update',
        active: 'Active',
        inactive: 'Inactive',
        archive: 'Archive',
        archiving: 'Archiving...',
      },
      uploader: {
        title: 'Product Images',
        dragDrop: 'Drag and drop images here',
        clickSelect: 'or click to select files',
        existing: 'Existing',
        new: 'New',
        replaceAll: 'Replace all images',
      },
      form: {
        productName: 'Product Name *',
        description: 'Description',
        locations: 'Locations',
        locationPlaceholder: 'Optional physical location',
      },
      inventoryPanel: {
        title: 'Inventory',
        quantity: 'Inventory quantity',
        lowStockAlert: 'Low stock alert',
      },
      categorization: {
        title: 'Categories',
        loading: 'Loading...',
        searchPlaceholder: 'Search categories...',
        noMatches: 'No matches',
      },
      unitsPanel: {
        title: 'Units',
        unit: 'Unit',
        unitPlaceholder: '-- Leave blank to keep current --',
        productType: 'Product Type',
        weight: 'Weight (kg)',
        price: 'Price (required)',
        addUnit: 'Add additional unit',
      },
    },

    // OCR
    ocr: {
      loading: 'Loading OCR...',
      errors: {
        noData: 'No data to confirm or not authenticated',
        noValidProducts: 'No valid products to create',
        addingProducts: 'Error adding products to inventory',
        processing: 'Error processing document. Please try again.',
      },
      cooldown: {
        wait: 'Wait',
        waitMessage: 'before processing another document',
      },
      buttons: {
        processing: 'Processing document...',
        upload: 'Upload and process',
        processAnother: 'Process Another',
      },
      result: {
        processedImage: 'Processed image with detections',
        imageDescription:
          'Image showing YOLO detections (green grids) and table regions (blue grids)',
        successMessage: 'Document processed successfully',
      },
      header: {
        title: 'OCR Processing',
        breadcrumbTools: 'Tools',
        breadcrumbOcr: 'OCR',
        description: 'Scan your document to see the recognized text',
      },
      fileUploader: {
        selectDocument: 'Select document',
        selected: 'Selected',
        selectFile: 'Select a file',
        formats: 'PNG, WEBP, JPG, JPEG (max 5MB)',
      },
      actionsBar: {
        saveChanges: 'Save changes',
        cancel: 'Cancel',
        editResult: 'Edit result',
        confirmData: 'Confirm Data',
        adding: 'Adding...',
      },
      itemsTable: {
        title: 'Detected items',
        name: 'Name',
        description: 'Description',
        quantity: 'Quantity',
        unitPrice: 'Unit Price',
        total: 'Total',
        confidence: 'Confidence',
        unnamed: 'Unnamed',
        noDescription: 'No description',
      },
      resultOverview: {
        title: 'OCR Processing Results',
        processedSuccess: 'Document processed successfully',
        file: 'file',
        documentInfo: 'Document Information',
        type: 'Type',
        invoice: 'Invoice',
        supplier: 'Supplier',
        date: 'Date',
        number: 'Number',
        noDocumentInfo: 'No document information found',
        financialSummary: 'Financial Summary',
        subtotal: 'Subtotal',
        taxes: 'Taxes',
        noFinancialSummary: 'No financial summary found',
      },
    },

    // Receipts
    receipts: {
      loading: 'Loading receipts...',
      errors: {
        loginRequired: 'You must log in to view receipts',
        loadError: 'Error loading receipts',
      },
      retry: 'Retry',
      header: {
        title: 'Receipts',
        breadcrumbFinances: 'Finances',
        breadcrumbReceipts: 'Receipts',
        description: 'Transaction history and receipts',
      },
      stats: {
        total: 'Total',
        completed: 'Completed',
        pending: 'Pending',
      },
      card: {
        order: 'Order',
        items: 'items',
        viewReceipt: 'View receipt',
        print: 'Print',
      },
      filters: {
        searchPlaceholder: 'Search receipts...',
        allStatuses: 'All',
        completed: 'Completed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        failed: 'Failed',
      },
      empty: {
        title: 'No receipts',
        description: "You don't have any receipts yet",
      },
      detail: {
        receipt: 'Receipt',
        items: 'Items',
        total: 'Total',
        method: 'Method',
        status: 'Status',
        cash: 'CASH',
        bitcoin: 'BITCOIN',
        completed: 'Completed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        purchaseReceipt: 'Purchase Receipt',
        orderDetails: 'Order Details',
        subtotal: 'Subtotal',
        noDetails: 'No details available',
        paymentMethod: 'Payment Method',
        cashLabel: 'Cash',
        cryptoLabel: 'Cryptocurrency',
        view: 'View',
        download: 'Download',
        refund: 'Refund',
        errorUpdating: 'Error updating order',
        product: 'Product',
      },
      grid: {
        loading: 'Loading receipts...',
        noReceipts: 'No receipts found',
        noReceiptsDesc:
          'Payment receipts will appear here when you make transactions.',
      },
      statsLabels: {
        totalReceipts: 'Total Receipts',
        totalAmount: 'Total Amount',
        completed: 'Completed',
      },
      crypto: {
        title: 'Cryptocurrency Receipts',
        description:
          'This section is enabled but there are no cryptocurrency receipts yet.',
        comingSoon: 'Coming Soon',
      },
      printModal: {
        title: 'Receipt Preview',
        purchaseReceipt: 'PURCHASE RECEIPT',
        date: 'Date',
        status: 'Status',
        product: 'Product',
        quantity: 'Quantity',
        unitPrice: 'Unit Price',
        total: 'Total',
        noItems: 'No items',
        thanks: 'Thank you for your purchase',
        close: 'Close',
        download: 'Download',
        print: 'Print',
      },
    },

    // Plugin Store
    pluginStore: {
      loading: 'Loading plugin store...',
      title: 'Plugin Store',
      description: 'Explore and manage ZatoBox commercial modules',
      breadcrumb: {
        tools: 'Tools',
        plugins: 'Plugins',
      },
      searchPlaceholder: 'Search plugins...',
      status: {
        active: 'Active',
        inactive: 'Inactive',
        comingSoon: 'Coming Soon',
        maintenance: 'Maintenance',
      },
      price: {
        free: 'Free',
        premium: 'Premium',
      },
      noPlugins: {
        title: 'No plugins found',
        description: 'Try adjusting your search',
      },
      loginRequired: 'Please log in to manage plugins',
      buttons: {
        activate: 'Activate',
        deactivate: 'Deactivate',
        inDevelopment: 'In Development',
        inMaintenance: 'In Maintenance',
      },
      featured: {
        title: '🔥 MOST INSTALLATIONS by Popularity',
      },
      more: 'more',
    },

    // Restock
    restock: {
      breadcrumb: {
        inventory: 'Inventory',
        restock: 'Restock',
      },
      title: 'Restock Inventory',
      description: 'Search products and add quantities to stock',
      searchPlaceholder: 'Search by name or SKU...',
      loading: 'Loading products...',
      errors: {
        loginRequired: 'You must log in',
        loadProducts: 'Error loading products',
        selectProduct: 'Select at least one product',
        enterQuantities: 'Enter quantities to restock',
        restockError: 'Error restocking',
      },
      currentStock: 'Current stock',
      units: 'units',
      noProducts: 'No products',
      noProductsFound: 'No products found',
      selected: 'Selected',
      stock: 'Stock',
      quantityPlaceholder: 'Quantity to add',
      selectToRestock: 'Select products to restock',
      pagination: {
        previous: '← Previous',
        next: 'Next →',
        page: 'Page',
        of: 'of',
      },
      submit: {
        processing: 'Processing...',
        confirm: 'Confirm Restock',
      },
      success: 'Restock completed!',
    },

    // Profile
    profile: {
      loading: 'Loading profile...',
      saving: 'Saving...',
      noChanges: 'No changes to save',
      updateSuccess: 'Profile updated successfully',
      avatarSuccess: 'Avatar updated successfully',
      errorEditing: 'Error editing profile',
      success: 'Success!',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      logout: 'Log Out',
      configured: 'Configured',
      notConfigured: 'Not configured',
      notProvided: 'Not provided',
      noEmail: 'No email provided',
      sections: {
        personalInfo: 'Personal Information',
        cryptoPayments: 'Crypto Payments',
        cryptoDescription:
          'Set up your BTCPay Server store to receive Bitcoin payments',
        account: 'Account',
      },
      fields: {
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
      },
      language: {
        title: 'Language',
        description: 'Select your preferred language',
        spanish: 'Español',
        english: 'English',
      },
    },

    // Wallet
    wallet: {
      loading: 'Loading wallet...',
      retry: 'Retry',
      errors: {
        loadConfig: 'Error loading wallet configuration',
        sendError: 'Error sending funds',
        connectionError: 'Connection error',
      },
      header: {
        finance: 'Finance',
        wallet: 'Wallet',
        title: 'Your Wallet',
        description: 'Manage your funds and make secure withdrawals',
      },
      setup: {
        title: 'Configure your Bitcoin Wallet',
        description:
          'To start receiving and managing Bitcoin payments, you need to activate your wallet. This process will create a unique and secure wallet for your store.',
        features: {
          segwit: 'SegWit Wallet',
          selfCustody: 'Self Custody',
          autoPayments: 'Automatic Payments',
        },
        button: 'Activate Wallet',
        securityNote:
          'Your private keys are generated locally and only you have access to them.',
      },
      send: {
        title: 'Send Funds',
        activeWallet: 'Active Wallet',
        successTitle: 'Transaction sent successfully!',
        successMessage: 'Your transaction has been broadcast to the network.',
        totalBalance: 'Total Balance',
        destinationLabel: 'Destination Address',
        amountLabel: 'Amount to Send',
        maxAmount: 'Leave empty to send maximum available',
        subtractFees: 'Subtract fee from amount',
        cantSeeTransaction: "Can't see your transaction?",
        networkPriority: 'Network Priority',
        priorities: {
          economic: 'Economic',
          standard: 'Standard',
          fast: 'Fast',
        },
        confirmButton: 'Confirm Send',
        processing: 'Processing...',
      },
      helpModal: {
        title: "Can't see your transaction?",
        description:
          'You may need to adjust the gap limit, starting index, or batch size in your wallet manager to find all your addresses',
        needHelp: {
          title: 'Need help?',
          description:
            "If you have issues with rescanning or don't see your transaction, our team can help you.",
        },
        feedback: {
          title: 'We want your feedback',
          description:
            'We are improving your experience and your feedback is key to helping us build the next improvement',
          button: 'Leave feedback',
        },
        done: 'Done',
      },
    },

    // Crypto Store Setup
    cryptoSetup: {
      loading: 'Loading configuration...',
      errorLoading: 'Error loading configuration',
      retry: 'Retry',
      title: 'Configure your Bitcoin Store',
      description:
        'To start receiving Bitcoin payments, you need to configure your store and create a wallet. This process is quick and secure.',
      whatIncludes: 'What does it include?',
      features: {
        store: 'Creation of your personal BTCPay store',
        wallet: 'Hot wallet generation with SegWit',
        recovery: '12 secure recovery words',
        payments: 'Automatic payment configuration',
      },
      setupButton: 'Finish setting up your store',
      configured: {
        title: '✓ Store Configured',
        description:
          'Your Bitcoin store is ready. All crypto payments will be processed automatically through your wallet.',
      },
      delete: {
        button: 'Delete Store and Wallet',
        confirmTitle: 'Are you sure?',
        confirmDescription:
          'This action will delete your store and wallet from the server. You will lose access to funds if you do not have your recovery phrase.',
        cancel: 'Cancel',
        continue: 'Continue',
        finalTitle: 'Final Confirmation!',
        finalDescription:
          'This action is IRREVERSIBLE. All data from your store and wallet will be deleted from our database and payment server. Do you confirm you want to delete everything permanently?',
        deleting: 'Deleting...',
        confirmDelete: 'Yes, delete everything',
        error: 'Error deleting store',
      },
    },

    // SideMenu
    sideMenu: {
      home: {
        name: 'Home',
        description: 'Main page',
      },
      inventory: {
        name: 'Inventory',
        description: 'Manage inventory',
      },
      smartInventory: {
        name: 'Smart Inventory',
        description: 'AI for inventory',
      },
      ocr: {
        name: 'OCR Documents',
        description: 'Process documents',
      },
      pos: {
        name: 'POS Integration',
        description: 'Integration with POS systems',
      },
      receipts: {
        name: 'Receipts',
        description: 'View purchase receipts',
      },
      restock: {
        name: 'Restock',
        description: 'Restock inventory',
      },
      wallet: {
        name: 'Wallet',
        description: 'Manage your funds',
      },
      pluginStore: {
        name: 'Plugin Store',
        description: 'Find modules',
      },
      profile: {
        name: 'Profile',
        description: 'Manage account',
      },
      feedback: {
        title: 'We want your feedback',
        description:
          'We are improving your experience and your opinion is key help us build the next improvement',
        button: 'Leave feedback',
      },
    },

    subscription: {
      cancelTitle: 'Cancel Subscription',
      cancelDescription: 'To cancel your subscription, please contact:',
      supportEmail: 'support@zatobox.com',
    },
  },
};

export function getTranslation(language: Language, key: string) {
  const keys = key.split('.');
  const translationObj = translations as Record<string, any>;
  let value: any = translationObj[language];

  if (!value) {
    return key;
  }

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  return value;
}
