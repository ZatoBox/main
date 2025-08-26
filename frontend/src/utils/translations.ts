import { Language } from '@/hooks/use-language'

export const translations = {
  es: {
               // Header
      nav: {
        features: "Características",
        pricing: "Precios",
        testimonials: "Testimonios",
        tryFree: "Enviar Feedback",
        navigation: "Navegación"
      },
     
     // Language
     language: {
       english: "EN",
       spanish: "ES"
     },
     
     // Accessibility and Alt texts
     accessibility: {
       altTexts: {
         logo: "Logo de Pointer",
         dashboard: "Vista previa del dashboard",
         companyLogo: "Logo de empresa",
         avatar: "avatar",
         bentoImages: {
           inventory: "Interfaz de Inventario en la Nube",
           ocr: "Interfaz de Scanner OCR Inteligente",
           payments: "Interfaz de Pagos Integrados",
           zatolink: "Interfaz de Zatolink Tienda Online",
           bitcoin: "Interfaz de Pago en Bitcoin",
           automation: "Interfaz de Automatización WhatsApp"
         }
       },
       ariaLabels: {
         twitter: "Twitter",
         github: "GitHub",
         linkedin: "LinkedIn",
         toggleNav: "Alternar menú de navegación",
         toggleSidebar: "Alternar barra lateral",
         close: "Cerrar",
         previousPage: "Ir a la página anterior",
         nextPage: "Ir a la página siguiente",
         previousSlide: "Diapositiva anterior",
         nextSlide: "Siguiente diapositiva",
         more: "Más"
       }
     },
    
    // Hero Section
    hero: {
      title: "Tu negocio, organizado y sin complicaciones.",
      subtitle: "Inventario digital + pagos fáciles con Stripe, PayPal y Mercado Pago. Todo en un solo lugar.",
      cta: "Probar gratis"
    },
    
    // Bento Section
    bento: {
      title: "Las herramientas que tu negocio realmente necesita",
      subtitle: "Desde el inventario hasta los pagos: todo conectado, simple y listo para usarse sin complicaciones técnicas.",
      cards: {
        inventory: {
          title: "Inventario En La Nube",
          description: "Controla tu stock en tiempo real y evita pérdidas por quiebres o sobrecompras."
        },
        ocr: {
          title: "Scanner Inteligente OCR:",
          description: "Olvídate de cargar productos a mano: digitaliza tus facturas y actualiza tu inventario automáticamente en cuestión de segundos."
        },
        payments: {
          title: "Pagos Integrados",
          description: "Acepta tarjetas y transferencias con Stripe, PayPal y Mercado Pago."
        },
        zatolink: {
          title: "En Desarrollo: Zatolink Tu Tienda Online",
          description: "Crea un link de venta único y comparte tu catálogo en redes sociales en segundos."
        },
        bitcoin: {
          title: "En Desarrollo: Pago En Bitcoin",
          description: "Transacciona en Bitcoin y Lightning Network para quienes quieran ir más allá."
        },
        automation: {
          title: "Próximamente: Módulos de automatización",
          description: "Haz crecer tu negocio con menos esfuerzo."
        }
      }
    },
    
         // Pricing Section
     pricing: {
       title: "Planes pensados para tu negocio, sin complicaciones",
       subtitle: "Durante el período Beta, todos nuestros planes son gratuitos. Después se habilitarán los precios regulares.",
       popular: "Popular",
       period: {
         tester: "/ 15 días",
         other: "/mes"
       },
       toggle: {
         annual: "Anual",
         monthly: "Mensual"
       },
       includes: "Incluye:",
       plans: {
         tester: {
           name: "Tester",
           description: "Perfecto para emprendedores que quieren probar Zatobox como solución.",
           features: [
             "Gestión básica de inventario",
             "Hasta 50 productos",
             "Pagos con Stripe, PayPal y Mercado Pago",
             "Tienda online simple con ZatoLink",
             "15 días gratis de prueba"
           ],
           buttonText: "Empezar gratis"
         },
         starter: {
           name: "Starter",
           description: "Ideal para PYMEs en crecimiento que necesitan más control y eficiencia. Gratuito durante el período Beta.",
           features: [
             "Todo del plan Tester",
             "Inventario ilimitado",
             "Soporte prioritario",
             "Acceso a las betas de cada módulo nuevo",
             "Se habilitará precio después del período Beta"
           ],
           buttonText: "Unirme ahora"
         },
         enterprise: {
           name: "Enterprise",
           description: "Soluciones completas para negocios medianos y grandes. Gratuito durante el período Beta.",
           features: [
             "Soporte dedicado",
             "Entrenamiento inicial para el equipo",
             "Opción de pago anual con descuento",
             "Se habilitará precio después del período Beta"
           ],
           buttonText: "Empezar gratis"
         }
       }
     },
    
         // Testimonials
     testimonials: {
       title: "Historias reales de negocios como el tuyo",
       subtitle: "Conoce cómo emprendedores y PYMEs usan ZatoBox para organizar su inventario, cobrar más fácil y hacer crecer su negocio.",
       items: [
         {
           quote: "Antes llevaba mi stock en cuadernos y Excel, perdía ventas por errores. Con ZatoBox ahora controlo todo desde mi celular y me sobra tiempo para atender clientes.",
           name: "Virginia López",
           company: "Tienda de Accesorios"
         },
         {
           quote: "Manejar inventario me quitaba horas todos los días. Con ZatoBox lo reviso en segundos y puedo enfocarme en atender mejor a mis clientes.",
           name: "Daniela Pérez",
           company: "Ferretería Ramírez"
         },
         {
           quote: "Mis clientes ya no tienen que pedirme cuentas manuales. Cobro con Stripe y Mercado Pago desde el mismo sistema, y se nota la diferencia en la confianza que transmito.",
           name: "Luis Andrade",
           company: "Productos Naturales"
         },
         {
           quote: "Con la prueba gratuita de 15 días confirmé que funcionaba: ahora tengo mi inventario ordenado y no pierdo tiempo cuadrando papeles.",
           name: "Carlos Herrera",
           company: "Tienda Local"
         },
         {
           quote: "Pasar de las planillas al panel de ZatoBox fue como quitarme un peso de encima. Ahora puedo enfocarme en crecer, no en cuadrar números todos los días.",
           name: "María González",
           company: "Minimarket San José"
         },
         {
           quote: "ZatoLink me permitió abrir mi tienda online sin saber nada de tecnología. Ahora comparto mi catálogo en Instagram y recibo pedidos directo desde ahí.",
           name: "Oscar Ramírez",
           company: "Moda y Ropa"
         },
         {
           quote: "Con ZatoBox todo es más fácil: inventario, pagos y ventas en un solo lugar. Hoy siento que mi negocio compite de igual a igual con cadenas grandes.",
           name: "Ana Torres",
           company: "Tienda de Abarrotes"
         }
       ]
     },
    
    // FAQ
    faq: {
      title: "Preguntas Frecuentes",
      subtitle: "Todo lo que necesitas saber sobre ZatoBox y cómo puede ayudarte a organizar tu inventario, cobrar más fácil y hacer crecer tu negocio.",
      questions: [
        {
          question: "¿Qué es ZatoBox y para quién es?",
          answer: "ZatoBox es una plataforma modular diseñada para emprendedores y PYMEs que quieren digitalizar su negocio sin complicaciones. Te permite organizar inventario, aceptar pagos digitales y vender en línea de manera simple."
        },
        {
          question: "¿Necesito experiencia en tecnología para usarlo?",
          answer: "No. ZatoBox está hecho para ser intuitivo. Puedes empezar a usarlo desde tu celular o computadora en minutos, sin conocimientos técnicos previos."
        },
        {
          question: "¿Puedo integrar mis pasarelas de pago?",
          answer: "Sí. ZatoBox soporta pagos con Stripe, PayPal y Mercado Pago. Además, pronto podrás aceptar Bitcoin y Lightning Network."
        },
        {
          question: "¿Qué incluye el plan gratis?",
          answer: "El plan Tester incluye gestión básica de inventario, hasta 50 productos, pagos con Stripe, PayPal y Mercado Pago, tienda online simple con ZatoLink y 15 días gratis de prueba. Es perfecto para emprendedores que quieren probar Zatobox como solución."
        },
        {
          question: "¿Puedo manejar varias tiendas con ZatoBox?",
          answer: "No por el momento, pero se espera que pronto podamos hacerlo. Con el plan Starter podrás centralizar tu inventario y ventas de varias sucursales en un solo panel, con control en tiempo real."
        },
        {
          question: "¿Mi información está segura en ZatoBox?",
          answer: "Sí. ZatoBox utiliza medidas modernas de seguridad y tu información siempre permanece bajo tu control. No se comparte ni se usa fuera de tu cuenta."
        }
      ]
    },
    
         // CTA Section
     cta: {
       title: "Vender y gestionar nunca fue tan fácil",
       subtitle: "Descubre cómo emprendedores y PYMEs organizan su inventario, cobran con pasarelas digitales y hacen crecer su negocio con ZatoBox.",
       button: "Probar gratis por 15 días"
     },
     
     // Social Proof
     socialProof: {
       text: "Acepta pagos fácilmente con nuestras pasarelas integradas"
     },
     
     // Footer
     footer: {
       description: "ZatoBox es la plataforma modular que ayuda a PYMEs y emprendedores a organizar inventario, aceptar pagos digitales y vender en línea de forma simple.",
       navigation: {
         title: "Navegación",
         features: "Características",
         pricing: "Precios"
       },
       moreInfo: {
         title: "Más Info",
         testimonials: "Testimonios",
         faq: "Preguntas Frecuentes"
       }
     }
  },
  
  en: {
               // Header
      nav: {
        features: "Features",
        pricing: "Pricing",
        testimonials: "Testimonials",
        tryFree: "Send Feedback",
        navigation: "Navigation"
      },
     
     // Language
     language: {
       english: "EN",
       spanish: "ES"
     },
     
     // Accessibility and Alt texts
     accessibility: {
       altTexts: {
         logo: "Pointer Logo",
         dashboard: "Dashboard preview",
         companyLogo: "Company Logo",
         avatar: "avatar",
         bentoImages: {
           inventory: "Cloud Inventory Interface",
           ocr: "Smart OCR Scanner Interface",
           payments: "Integrated Payments Interface",
           zatolink: "Zatolink Online Store Interface",
           bitcoin: "Bitcoin Payment Interface",
           automation: "WhatsApp Automation Interface"
         }
       },
       ariaLabels: {
         twitter: "Twitter",
         github: "GitHub",
         linkedin: "LinkedIn",
         toggleNav: "Toggle navigation menu",
         toggleSidebar: "Toggle Sidebar",
         close: "Close",
         previousPage: "Go to previous page",
         nextPage: "Go to next page",
         previousSlide: "Previous slide",
         nextSlide: "Next slide",
         more: "More"
       }
     },
    
    // Hero Section
    hero: {
      title: "Your business, organized and hassle-free.",
      subtitle: "Digital inventory + easy payments with Stripe, PayPal and Mercado Pago. Everything in one place.",
      cta: "Try free"
    },
    
    // Bento Section
    bento: {
      title: "The tools your business really needs",
      subtitle: "From inventory to payments: everything connected, simple and ready to use without technical complications.",
      cards: {
        inventory: {
          title: "Cloud Inventory",
          description: "Control your stock in real-time and avoid losses from stockouts or over-purchases."
        },
        ocr: {
          title: "Smart OCR Scanner:",
          description: "Forget about manually loading products: digitize your invoices and update your inventory automatically in seconds."
        },
        payments: {
          title: "Integrated Payments",
          description: "Accept cards and transfers with Stripe, PayPal and Mercado Pago."
        },
        zatolink: {
          title: "In Development: Zatolink Your Online Store",
          description: "Create a unique sales link and share your catalog on social media in seconds."
        },
        bitcoin: {
          title: "In Development: Bitcoin Payment",
          description: "Transact in Bitcoin and Lightning Network for those who want to go further."
        },
        automation: {
          title: "Coming Soon: Automation Modules",
          description: "Grow your business with less effort."
        }
      }
    },
    
         // Pricing Section
     pricing: {
       title: "Plans designed for your business, without complications",
       subtitle: "During the Beta period, all our plans are free. Regular prices will be enabled later.",
       popular: "Popular",
       period: {
         tester: "/ 15 days",
         other: "/month"
       },
       toggle: {
         annual: "Annual",
         monthly: "Monthly"
       },
       includes: "Includes:",
       plans: {
         tester: {
           name: "Tester",
           description: "Perfect for entrepreneurs who want to try Zatobox as a solution.",
           features: [
             "Basic inventory management",
             "Up to 50 products",
             "Payments with Stripe, PayPal and Mercado Pago",
             "Simple online store with ZatoLink",
             "15 days free trial"
           ],
           buttonText: "Start free"
         },
         starter: {
           name: "Starter",
           description: "Ideal for growing SMEs that need more control and efficiency. Free during the Beta period.",
           features: [
             "Everything from Tester plan",
             "Unlimited inventory",
             "Priority support",
             "Access to betas of each new module",
             "Price will be enabled after Beta period"
           ],
           buttonText: "Join now"
         },
         enterprise: {
           name: "Enterprise",
           description: "Complete solutions for medium and large businesses. Free during the Beta period.",
           features: [
             "Dedicated support",
             "Initial team training",
             "Annual payment option with discount",
             "Price will be enabled after Beta period"
           ],
           buttonText: "Start free"
         }
       }
     },
    
         // Testimonials
     testimonials: {
       title: "Real stories from businesses like yours",
       subtitle: "Learn how entrepreneurs and SMEs use ZatoBox to organize their inventory, collect payments more easily and grow their business.",
       items: [
         {
           quote: "Before I used to carry my stock in notebooks and Excel, I lost sales due to errors. With ZatoBox now I control everything from my phone and I have time left to attend to customers.",
           name: "Virginia López",
           company: "Accessories Store"
         },
         {
           quote: "Managing inventory took me hours every day. With ZatoBox I review it in seconds and can focus on better serving my customers.",
           name: "Daniela Pérez",
           company: "Ramírez Hardware Store"
         },
         {
           quote: "My customers no longer have to ask me for manual accounts. I collect with Stripe and Mercado Pago from the same system, and you can notice the difference in the confidence I transmit.",
           name: "Luis Andrade",
           company: "Natural Products"
         },
         {
           quote: "With the 15-day free trial I confirmed it worked: now I have my inventory organized and I don't waste time balancing papers.",
           name: "Carlos Herrera",
           company: "Local Store"
         },
         {
           quote: "Going from spreadsheets to ZatoBox's panel was like taking a weight off my shoulders. Now I can focus on growing, not balancing numbers every day.",
           name: "María González",
           company: "San José Minimarket"
         },
         {
           quote: "ZatoLink allowed me to open my online store without knowing anything about technology. Now I share my catalog on Instagram and receive orders directly from there.",
           name: "Oscar Ramírez",
           company: "Fashion and Clothing"
         },
         {
           quote: "With ZatoBox everything is easier: inventory, payments and sales in one place. Today I feel that my business competes on equal terms with large chains.",
           name: "Ana Torres",
           company: "Grocery Store"
         }
       ]
     },
    
    // FAQ
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about ZatoBox and how it can help you organize your inventory, collect payments more easily and grow your business.",
      questions: [
        {
          question: "What is ZatoBox and who is it for?",
          answer: "ZatoBox is a modular platform designed for entrepreneurs and SMEs who want to digitize their business without complications. It allows you to organize inventory, accept digital payments and sell online in a simple way."
        },
        {
          question: "Do I need technology experience to use it?",
          answer: "No. ZatoBox is made to be intuitive. You can start using it from your phone or computer in minutes, without prior technical knowledge."
        },
        {
          question: "Can I integrate my payment gateways?",
          answer: "Yes. ZatoBox supports payments with Stripe, PayPal and Mercado Pago. Additionally, you'll soon be able to accept Bitcoin and Lightning Network."
        },
        {
          question: "What does the free plan include?",
          answer: "The Tester plan includes basic inventory management, up to 50 products, payments with Stripe, PayPal and Mercado Pago, simple online store with ZatoLink and 15 days free trial. It's perfect for entrepreneurs who want to try Zatobox as a solution."
        },
        {
          question: "Can I manage multiple stores with ZatoBox?",
          answer: "Not at the moment, but we expect to be able to do so soon. With the Starter plan you'll be able to centralize your inventory and sales from multiple branches in a single panel, with real-time control."
        },
        {
          question: "Is my information safe in ZatoBox?",
          answer: "Yes. ZatoBox uses modern security measures and your information always remains under your control. It is not shared or used outside your account."
        }
      ]
    },
    
         // CTA Section
     cta: {
       title: "Selling and managing has never been so easy",
       subtitle: "Discover how entrepreneurs and SMEs organize their inventory, collect payments with digital gateways and grow their business with ZatoBox.",
       button: "Try free for 15 days"
     },
     
     // Social Proof
     socialProof: {
       text: "Accept payments easily with our integrated gateways"
     },
     
     // Footer
     footer: {
       description: "ZatoBox is the modular platform that helps SMEs and entrepreneurs organize inventory, accept digital payments and sell online in a simple way.",
       navigation: {
         title: "Navigation",
         features: "Features",
         pricing: "Pricing"
       },
       moreInfo: {
         title: "More Info",
         testimonials: "Testimonials",
         faq: "Frequently Asked Questions"
       }
     }
  }
}

export function getTranslation(language: Language, key: string) {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Fallback to key if translation not found
    }
  }
  
  return value
}
