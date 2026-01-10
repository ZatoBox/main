import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      'header.features': 'Features',
      'header.pricing': 'Pricing',
      'header.blog': 'Blog',
      'header.getStarted': 'Get started',
      'hero.clarity': 'Clarity!',
      'hero.title1': 'See Your Business Clearly.',
      'hero.title2': 'Stop Guessing.',
      'hero.description':
        'A free point of sale (POS) and inventory management system for small physical stores. Simple sales tracking and stock control, built for real stores.',
      'hero.pos': 'Point of Sale',
      'hero.posDesc': 'Sell in-person, accept Bitcoin',
      'hero.inventory': 'Inventory Control',
      'hero.inventoryDesc': 'Real-time stock tracking',
      'hero.visibility': 'Full Visibility',
      'hero.visibilityDesc': 'See everything clearly',
      'hero.noComplexity': 'No Complexity',
      'hero.noComplexityDesc': 'Simple enough for daily use',
      'hero.joinNow': 'Join now',
      'whatIs.title': 'What is ZatoBox?',
      'whatIs.definition':
        'ZatoBox is a free point of sale (POS) and inventory system for small physical stores. It helps store owners sell in person, track inventory in real time, and understand their sales, with optional Bitcoin payments.',
      'whatIs.whatTitle': 'Point of Sale + Inventory',
      'whatIs.whatDesc':
        'A simple cashier system combined with real-time inventory management. Record sales, track stock, and see your business clearly, all in one place.',
      'whatIs.forWhoTitle': 'For Small Physical Stores',
      'whatIs.forWhoDesc':
        'Built for tiendas, minimarkets, local shops, and retail businesses. No complex setup, no unnecessary features. Just what you need to run your store.',
      'whatIs.solvesTitle': 'Everyday Problems Solved',
      'whatIs.solvesDesc':
        "Know what's selling, what's running low, and when to restock. Make decisions based on real data, not guesses. Track sales and inventory effortlessly.",
      'problem.openLetter': 'Open Letter',
      'problem.heyOwner': 'Hey Store Owner!',
      'problem.growTitle':
        'Your Business Grows When You Can Clearly See Your Sales and Inventory',
      'problem.intro':
        'As a store owner, you put real work into your business every day. Early mornings. Long days. Decisions that matter. You do all of that to keep your store running and moving forward.',
      'problem.question': "But here's an honest question:",
      'problem.questionBold':
        "Do you really see what's happening inside your business?",
      'problem.truth':
        "The truth is, most small businesses don't fail because they don't sell. They struggle because they can't clearly see their sales, inventory, and stock movements.",
      'problem.noVisibility':
        "When you don't have visibility: Inventory becomes a guess. Sales numbers feel unclear. Profits are harder to track.",
      'problem.solution':
        "You shouldn't have to guess what's happening in your store. Your",
      'problem.pointOfSale': 'point of sale',
      'problem.your': ', your',
      'problem.inventoryControl': 'inventory control',
      'problem.solutionEnd':
        ', and your daily sales already tell the full story. You just need a simple POS system that shows it clearly.',
      'problem.zatoboxHelps': "That's exactly where",
      'problem.helps': 'helps.',
      'problem.hearItOut': 'Hear it out',
      'problem.whyVisibility': 'Why Visibility Matters in Your Store',
      'problem.whyVisibilityDesc':
        "Because understanding your business isn't optional it's how you stay in control.",
      'problem.compass': 'Your Inventory Is Your Compass',
      'problem.compassDesc':
        "Your inventory shows what's selling, what's stuck, and what you'll need next. With clear inventory control, every number becomes a signal not a guess.",
      'problem.losses': 'Losses Happen Visibility Reduces Them',
      'problem.lossesDesc':
        'Shrinkage and mistakes are part of running a store. What makes the difference is seeing them early through your point of sale system and stock movements.',
      'problem.decisions': "Better Decisions Don't Come From Guessing",
      'problem.decisionsDesc':
        'Your best restocking decisions come from patterns, not instincts. When your POS system shows real data, you make smarter moves with confidence.',
      'problem.success': 'Success Feels Better When You Can See It',
      'problem.successDesc':
        'When inventory is balanced and margins make sense, stress goes down. Clear sales visibility helps your business grow in a healthier way day by day.',
      'features.label': 'Features',
      'features.title': 'The simplest POS + Inventory',
      'features.description':
        'Discover ZatoBox modules! Everything you need to run your store with clarity and control.',
      'features.pos': 'POS',
      'features.posSubtitle': 'Sell in-person easily.',
      'features.posTitle': 'Point of Sale',
      'features.posDesc':
        'A simple cashier system to sell in-person and accept Bitcoin payments. No banks required.',
      'features.inventory': 'Inventory',
      'features.inventorySubtitle': 'Real-time stock control.',
      'features.inventoryTitle': 'Inventory Management',
      'features.inventoryDesc':
        'Real-time stock control linked directly to sales and purchases. Always know what you have.',
      'features.bulkImport': 'Bulk Import',
      'features.bulkImportSubtitle': 'Update products fast.',
      'features.bulkImportTitle': 'Quick JSON Importer',
      'features.bulkImportDesc':
        'Import or update products in bulk using structured JSON files. Fast and without manual work.',
      'features.history': 'History',
      'features.historySubtitle': 'Full transaction records.',
      'features.historyTitle': 'Receipts & History',
      'features.historyDesc':
        'Full transaction history with receipts for every sale. Everything documented, nothing lost.',
      'features.ocr': 'OCR Scanning',
      'features.ocrSubtitle': 'Scan supplier invoices automatically',
      'features.ocrTitle': 'OCR Scanning',
      'features.ocrDesc':
        'Automatically scan and process supplier invoices. Extract data without manual entry and save hours of work.',
      'features.restock': 'Restock Module',
      'features.restockSubtitle': 'Replenish inventory in a few steps',
      'features.restockTitle': 'Restock Module',
      'features.restockDesc':
        'Replenish your inventory quickly and efficiently. Set reorder points and get alerts when stock is low.',
      'features.bitcoin': 'Bitcoin Wallet',
      'features.bitcoinSubtitle': 'Manage BTC from sales directly',
      'features.bitcoinTitle': 'Bitcoin Wallet',
      'features.bitcoinDesc':
        'Manage Bitcoin received from sales directly within ZatoBox. View balances, send, and receive BTC easily.',
      'dashboard.label': 'Dashboard',
      'dashboard.title': "Here's the Deal",
      'dashboard.desc1':
        "You can't run a store if you can't see what's happening. Every sale recorded, every product counted, every decision based on real data brings you closer to control.",
      'dashboard.desc2':
        'With a clear POS dashboard, your business stops being a guess and starts making sense.',
      'dashboard.joinBeta': 'Try free',
      'dashboard.settingsTitle': 'Store settings, your way',
      'dashboard.settingsDesc':
        'Set up your store preferences, products, and basic rules in one place. Simple, clear, and easy to adjust as your business grows.',
      'dashboard.alertsTitle': 'Low stock alerts and key notifications',
      'dashboard.alertsDesc':
        'Get notified when inventory runs low or when something needs your attention, so you can act before problems appear.',
      'pricing.label': 'Pricing',
      'pricing.title': 'Plans to Fit Your Needs',
      'pricing.description':
        'From small tiendas to growing stores, ZatoBox has a plan that brings you clarity.',
      'pricing.freeBeta': 'Free Beta',
      'pricing.earlyAccess': 'Early access',
      'pricing.free': 'Free',
      'pricing.duringBeta': 'during beta',
      'pricing.joinNow': 'Join now',
      'pricing.proPlan': 'Pro Plan',
      'pricing.comingSoon': 'Coming soon',
      'pricing.fullPos': 'Full POS functionality',
      'pricing.inventoryManagement': 'Inventory management',
      'pricing.transactionHistory': 'Transaction history',
      'pricing.bitcoinPayments': 'Bitcoin payments',
      'pricing.allFromFree': 'All from Free plan',
      'pricing.ocrScanning': 'OCR document scanning',
      'pricing.advancedAnalytics': 'Advanced analytics',
      'pricing.prioritySupport': 'Priority support',
      'faq.label': 'Transparency',
      'faq.title': 'Frequently Asked Questions',
      'faq.description': 'Everything you need to know about ZatoBox',
      'faq.q1': 'What is ZatoBox?',
      'faq.a1':
        'ZatoBox is a free point of sale (POS) and inventory management system designed for small physical stores. It helps store owners track sales, manage stock in real time, and make data-driven decisions.',
      'faq.q2': 'Is ZatoBox free?',
      'faq.a2':
        'Yes, ZatoBox offers a free tier for small stores. As your business grows, we have affordable plans that scale with your needs.',
      'faq.q3': 'Who is ZatoBox for?',
      'faq.a3':
        'ZatoBox is designed for small physical stores, local shops, tiendas, minimarkets, and retail businesses that want a simple way to manage sales and inventory without complexity.',
      'faq.q4': 'What does ZatoBox help with?',
      'faq.a4':
        'ZatoBox helps you record sales, track inventory in real time, see transaction history, set low-stock alerts, and understand your business with clear data. No spreadsheets or guesswork needed.',
      'faq.q5': 'Do I need technical knowledge to use ZatoBox?',
      'faq.a5':
        'Not at all. ZatoBox is designed to be simple and intuitive. If you can use a smartphone, you can use ZatoBox.',
      'faq.q6': 'Does ZatoBox support Bitcoin payments?',
      'faq.a6':
        'Yes, Bitcoin payments are available as an optional feature. ZatoBox works as a complete POS and inventory system without Bitcoin. Store owners who want to accept cryptocurrency can enable this feature, and they maintain full control of their funds as ZatoBox is non-custodial.',
      'cta.label': 'Get Started',
      'cta.title': 'Start Using ZatoBox Today',
      'cta.desc1': 'Your store deserves clarity. Stop guessing.',
      'cta.desc2': 'Start using',
      'cta.posInventory': 'POS and inventory system',
      'cta.desc3': 'built for real stores.',
      'cta.desc4':
        'Set up your store, track sales, and control inventory from day one without complexity.',
      'cta.button': 'Get started for free',
      'cta.footer': 'Early access · Feedback welcome · No lock-in',
      'footer.tagline': 'With real-time',
      'footer.taglineBold': 'sales and inventory data',
      'footer.taglineEnd': 'in one simple dashboard.',
      'footer.contact': 'Contact us',
      'footer.blog': 'Blog',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms',
      'footer.copyright': '© 2026 ZatoBox. All rights reserved.',
      'header.sendFeedback': 'Send Feedback',
      'header.joinBeta': 'Try free',
      'common.backToHome': 'Back to Home',
      'common.backToBlog': 'Back to blog',
      'common.minRead': 'min read',
    },
  },
  es: {
    translation: {
      'header.features': 'Funciones',
      'header.pricing': 'Precios',
      'header.blog': 'Blog',
      'header.getStarted': 'Comenzar',
      'hero.clarity': '¡Claridad!',
      'hero.title1': 'Ve Tu Negocio Claramente.',
      'hero.title2': 'Deja de Adivinar.',
      'hero.description':
        'Un sistema gratuito de punto de venta (POS) y gestión de inventario para pequeñas tiendas físicas. Seguimiento simple de ventas y control de stock, hecho para tiendas reales.',
      'hero.pos': 'Punto de Venta',
      'hero.posDesc': 'Vende en persona, acepta Bitcoin',
      'hero.inventory': 'Control de Inventario',
      'hero.inventoryDesc': 'Seguimiento de stock en tiempo real',
      'hero.visibility': 'Visibilidad Total',
      'hero.visibilityDesc': 'Ve todo claramente',
      'hero.noComplexity': 'Sin Complejidad',
      'hero.noComplexityDesc': 'Simple para uso diario',
      'hero.joinNow': 'Únirme ahora',
      'whatIs.title': '¿Qué es ZatoBox?',
      'whatIs.definition':
        'ZatoBox es un sistema gratuito de punto de venta (POS) e inventario para pequeñas tiendas físicas. Ayuda a los dueños de tienda a vender en persona, rastrear inventario en tiempo real y entender sus ventas, con pagos opcionales en Bitcoin.',
      'whatIs.whatTitle': 'Punto de Venta + Inventario',
      'whatIs.whatDesc':
        'Un sistema de caja simple combinado con gestión de inventario en tiempo real. Registra ventas, rastrea stock y ve tu negocio claramente, todo en un solo lugar.',
      'whatIs.forWhoTitle': 'Para Pequeñas Tiendas Físicas',
      'whatIs.forWhoDesc':
        'Hecho para tiendas, minimercados, comercios locales y negocios minoristas. Sin configuración compleja, sin funciones innecesarias. Solo lo que necesitas para manejar tu tienda.',
      'whatIs.solvesTitle': 'Problemas Diarios Resueltos',
      'whatIs.solvesDesc':
        'Sabe qué se vende, qué está bajando y cuándo reabastecer. Toma decisiones basadas en datos reales, no en adivinanzas. Rastrea ventas e inventario sin esfuerzo.',
      'problem.openLetter': 'Carta Abierta',
      'problem.heyOwner': '¡Hola Dueño de Tienda!',
      'problem.growTitle':
        'Tu Negocio Crece Cuando Puedes Ver Claramente Tus Ventas e Inventario',
      'problem.intro':
        'Como dueño de tienda, pones trabajo real en tu negocio cada día. Madrugadas. Días largos. Decisiones que importan. Todo eso para mantener tu tienda funcionando y avanzando.',
      'problem.question': 'Pero aquí hay una pregunta honesta:',
      'problem.questionBold':
        '¿Realmente ves lo que está pasando dentro de tu negocio?',
      'problem.truth':
        'La verdad es que la mayoría de los pequeños negocios no fracasan porque no venden. Luchan porque no pueden ver claramente sus ventas, inventario y movimientos de stock.',
      'problem.noVisibility':
        'Cuando no tienes visibilidad: El inventario se vuelve una adivinanza. Los números de ventas se sienten confusos. Las ganancias son más difíciles de rastrear.',
      'problem.solution':
        'No deberías tener que adivinar lo que pasa en tu tienda. Tu',
      'problem.pointOfSale': 'punto de venta',
      'problem.your': ', tu',
      'problem.inventoryControl': 'control de inventario',
      'problem.solutionEnd':
        ', y tus ventas diarias ya cuentan toda la historia. Solo necesitas un sistema POS simple que lo muestre claramente.',
      'problem.zatoboxHelps': 'Ahí es exactamente donde',
      'problem.helps': 'ayuda.',
      'problem.hearItOut': 'Escucha esto',
      'problem.whyVisibility': 'Por Qué la Visibilidad Importa en Tu Tienda',
      'problem.whyVisibilityDesc':
        'Porque entender tu negocio no es opcional, es cómo mantienes el control.',
      'problem.compass': 'Tu Inventario Es Tu Brújula',
      'problem.compassDesc':
        'Tu inventario muestra qué se vende, qué está estancado y qué necesitarás después. Con un control de inventario claro, cada número se convierte en una señal, no una adivinanza.',
      'problem.losses': 'Las Pérdidas Ocurren, la Visibilidad las Reduce',
      'problem.lossesDesc':
        'El encogimiento y los errores son parte de manejar una tienda. Lo que hace la diferencia es verlos temprano a través de tu sistema de punto de venta y movimientos de stock.',
      'problem.decisions': 'Las Mejores Decisiones No Vienen de Adivinar',
      'problem.decisionsDesc':
        'Tus mejores decisiones de reabastecimiento vienen de patrones, no de instintos. Cuando tu sistema POS muestra datos reales, tomas decisiones más inteligentes con confianza.',
      'problem.success': 'El Éxito Se Siente Mejor Cuando Puedes Verlo',
      'problem.successDesc':
        'Cuando el inventario está balanceado y los márgenes tienen sentido, el estrés baja. La visibilidad clara de ventas ayuda a tu negocio a crecer de manera más saludable día a día.',
      'features.label': 'Funciones',
      'features.title': 'El POS + Inventario más simple',
      'features.description':
        '¡Descubre los módulos de ZatoBox! Todo lo que necesitas para manejar tu tienda con claridad y control.',
      'features.pos': 'POS',
      'features.posSubtitle': 'Vende en persona fácilmente.',
      'features.posTitle': 'Punto de Venta',
      'features.posDesc':
        'Un sistema de caja simple para vender en persona y aceptar pagos en Bitcoin. Sin bancos necesarios.',
      'features.inventory': 'Inventario',
      'features.inventorySubtitle': 'Control de stock en tiempo real.',
      'features.inventoryTitle': 'Gestión de Inventario',
      'features.inventoryDesc':
        'Control de stock en tiempo real vinculado directamente a ventas y compras. Siempre sabrás lo que tienes.',
      'features.bulkImport': 'Importación Masiva',
      'features.bulkImportSubtitle': 'Actualiza productos rápido.',
      'features.bulkImportTitle': 'Importador JSON Rápido',
      'features.bulkImportDesc':
        'Importa o actualiza productos en masa usando archivos JSON estructurados. Rápido y sin trabajo manual.',
      'features.history': 'Historial',
      'features.historySubtitle': 'Registros completos de transacciones.',
      'features.historyTitle': 'Recibos e Historial',
      'features.historyDesc':
        'Historial completo de transacciones con recibos para cada venta. Todo documentado, nada perdido.',
      'features.ocr': 'Escaneo OCR',
      'features.ocrSubtitle': 'Escanea facturas de proveedores automáticamente',
      'features.ocrTitle': 'Escaneo OCR',
      'features.ocrDesc':
        'Escanea y procesa automáticamente facturas de proveedores. Extrae datos sin entrada manual y ahorra horas de trabajo.',
      'features.restock': 'Módulo de Reabastecimiento',
      'features.restockSubtitle': 'Repón inventario en pocos pasos',
      'features.restockTitle': 'Módulo de Reabastecimiento',
      'features.restockDesc':
        'Repón tu inventario rápida y eficientemente. Establece puntos de reorden y recibe alertas cuando el stock esté bajo.',
      'features.bitcoin': 'Cartera Bitcoin',
      'features.bitcoinSubtitle': 'Administra BTC de ventas directamente',
      'features.bitcoinTitle': 'Cartera Bitcoin',
      'features.bitcoinDesc':
        'Administra Bitcoin recibido de ventas directamente en ZatoBox. Ve saldos, envía y recibe BTC fácilmente.',
      'dashboard.label': 'Panel',
      'dashboard.title': 'Esto Es Lo Que Ofrecemos',
      'dashboard.desc1':
        'No puedes manejar una tienda si no puedes ver lo que está pasando. Cada venta registrada, cada producto contado, cada decisión basada en datos reales te acerca más al control.',
      'dashboard.desc2':
        'Con un panel POS claro, tu negocio deja de ser una adivinanza y empieza a tener sentido.',
      'dashboard.joinBeta': 'Probar gratis',
      'dashboard.settingsTitle': 'Configuración de tienda, a tu manera',
      'dashboard.settingsDesc':
        'Configura las preferencias de tu tienda, productos y reglas básicas en un solo lugar. Simple, claro y fácil de ajustar a medida que tu negocio crece.',
      'dashboard.alertsTitle': 'Alertas de stock bajo y notificaciones clave',
      'dashboard.alertsDesc':
        'Recibe notificaciones cuando el inventario esté bajo o cuando algo necesite tu atención, para que puedas actuar antes de que aparezcan problemas.',
      'pricing.label': 'Precios',
      'pricing.title': 'Planes Para Tus Necesidades',
      'pricing.description':
        'Desde pequeñas tiendas hasta negocios en crecimiento, ZatoBox tiene un plan que te da claridad.',
      'pricing.freeBeta': 'Beta Gratis',
      'pricing.earlyAccess': 'Acceso anticipado',
      'pricing.free': 'Gratis',
      'pricing.duringBeta': 'durante la beta',
      'pricing.joinNow': 'Únete ahora',
      'pricing.proPlan': 'Plan Pro',
      'pricing.comingSoon': 'Próximamente',
      'pricing.fullPos': 'Funcionalidad POS completa',
      'pricing.inventoryManagement': 'Gestión de inventario',
      'pricing.transactionHistory': 'Historial de transacciones',
      'pricing.bitcoinPayments': 'Pagos en Bitcoin',
      'pricing.allFromFree': 'Todo del plan Gratis',
      'pricing.ocrScanning': 'Escaneo OCR de documentos',
      'pricing.advancedAnalytics': 'Analíticas avanzadas',
      'pricing.prioritySupport': 'Soporte prioritario',
      'faq.label': 'Transparencia',
      'faq.title': 'Preguntas Frecuentes',
      'faq.description': 'Todo lo que necesitas saber sobre ZatoBox',
      'faq.q1': '¿Qué es ZatoBox?',
      'faq.a1':
        'ZatoBox es un sistema gratuito de punto de venta (POS) y gestión de inventario diseñado para pequeñas tiendas físicas. Ayuda a los dueños de tienda a rastrear ventas, gestionar stock en tiempo real y tomar decisiones basadas en datos.',
      'faq.q2': '¿ZatoBox es gratis?',
      'faq.a2':
        'Sí, ZatoBox ofrece un plan gratuito para tiendas pequeñas. A medida que tu negocio crece, tenemos planes accesibles que escalan con tus necesidades.',
      'faq.q3': '¿Para quién es ZatoBox?',
      'faq.a3':
        'ZatoBox está diseñado para pequeñas tiendas físicas, comercios locales, tiendas de barrio, minimercados y negocios minoristas que quieren una forma simple de gestionar ventas e inventario sin complejidad.',
      'faq.q4': '¿En qué ayuda ZatoBox?',
      'faq.a4':
        'ZatoBox te ayuda a registrar ventas, rastrear inventario en tiempo real, ver historial de transacciones, configurar alertas de stock bajo y entender tu negocio con datos claros. Sin hojas de cálculo ni adivinanzas.',
      'faq.q5': '¿Necesito conocimientos técnicos para usar ZatoBox?',
      'faq.a5':
        'Para nada. ZatoBox está diseñado para ser simple e intuitivo. Si puedes usar un smartphone, puedes usar ZatoBox.',
      'faq.q6': '¿ZatoBox acepta pagos en Bitcoin?',
      'faq.a6':
        'Sí, los pagos en Bitcoin están disponibles como función opcional. ZatoBox funciona como un sistema POS e inventario completo sin Bitcoin. Los dueños que quieran aceptar criptomonedas pueden habilitar esta función, y mantienen control total de sus fondos ya que ZatoBox no es custodia.',
      'cta.label': 'Comenzar',
      'cta.title': 'Comienza a Usar ZatoBox Hoy',
      'cta.desc1': 'Tu tienda merece claridad. Deja de adivinar.',
      'cta.desc2': 'Comienza a usar',
      'cta.posInventory': 'sistema POS e inventario',
      'cta.desc3': 'hecho para tiendas reales.',
      'cta.desc4':
        'Configura tu tienda, rastrea ventas y controla inventario desde el día uno sin complejidad.',
      'cta.button': 'Comienza gratis',
      'cta.footer':
        'Acceso anticipado · Comentarios bienvenidos · Sin compromiso',
      'footer.tagline': 'Con datos de',
      'footer.taglineBold': 'ventas e inventario en tiempo real',
      'footer.taglineEnd': 'en un panel simple.',
      'footer.contact': 'Contáctanos',
      'footer.blog': 'Blog',
      'footer.privacy': 'Política de Privacidad',
      'footer.terms': 'Términos',
      'footer.copyright': '© 2026 ZatoBox. Todos los derechos reservados.',
      'header.sendFeedback': 'Enviar Comentarios',
      'header.joinBeta': 'Probar gratis',
      'common.backToHome': 'Volver al Inicio',
      'common.backToBlog': 'Volver al blog',
      'common.minRead': 'min de lectura',
    },
  },
};

const isClient = typeof window !== 'undefined';

if (!i18n.isInitialized) {
  if (isClient) {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: isClient ? undefined : 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    detection: isClient
      ? {
          order: ['navigator', 'htmlTag', 'path', 'subdomain'],
          caches: ['localStorage'],
        }
      : undefined,
  });
}

export default i18n;
