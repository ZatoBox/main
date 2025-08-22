/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Updated according to specifications
        primary: {
          DEFAULT: '#FDE388', // Changed to primary-500 as DEFAULT
          50: '#FFFAEB', // Hover muy suave
          100: '#FFF3C4', // Hover suave
          200: '#FFF3C4',
          300: '#FFEC9D',
          400: '#FFE576',
          500: '#FDE388', // DEFAULT (CTAs principales)
          600: '#FFD84F', // Hover/active de primary
          700: '#FFD12D', // Estado presionado
          800: '#E6C000', // Estado crítico o fondo de highlight
          900: '#B8A000', // Texto sobre primary para máximo contraste
        },
        complement: {
          DEFAULT: '#14B8A6', // DEFAULT (tooltips, links)
          50: '#E6FFFA', // Fondo muy suave de toasts/info
          100: '#B2F5EA', // Fondo de badge/info
          200: '#81E6D9',
          300: '#4FD1C7',
          400: '#38B2AC',
          500: '#14B8A6', // DEFAULT (tooltips, links)
          600: '#0F9488', // Hover/active de complement
          700: '#0D7377', // Estado presionado
          800: '#0A5D62',
          900: '#064E3B', // Texto sobre complement
        },
        secondary: {
          DEFAULT: '#3B82F6', // DEFAULT (botones secundarios)
          50: '#EBF4FF', // Hover muy suave de secundarios
          100: '#DBEAFE', // Hover suave
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // DEFAULT (botones secundarios)
          600: '#2563EB', // Hover/active de secondary
          700: '#1D4ED8', // Estado presionado
          800: '#1E40AF',
          900: '#1E3A8A', // Texto sobre secondary
        },
        success: {
          DEFAULT: '#10B981', // DEFAULT (toasts, badges de OK)
          50: '#ECFDF5', // Fondo muy suave de toasts
          100: '#D1FAE5', // Fondo de badge de éxito
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // DEFAULT (toasts, badges de OK)
          600: '#059669', // Hover/active de success
          700: '#047857', // Estado presionado
          800: '#065F46',
          900: '#064E3B', // Texto sobre success
        },
        warning: {
          DEFAULT: '#F59E0B', // DEFAULT (alertas moderadas)
          50: '#FFFBEB', // Fondo muy suave de alertas
          100: '#FEF3C7', // Fondo de badge warning
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // DEFAULT (alertas moderadas)
          600: '#D97706', // Hover/active de warning
          700: '#B45309', // Estado presionado
          800: '#92400E',
          900: '#78350F', // Texto sobre warning
        },
        error: {
          DEFAULT: '#DC2626', // DEFAULT (errores críticos)
          50: '#FEF2F2', // Fondo muy suave de errores
          100: '#FEE2E2', // Fondo de badge error
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // DEFAULT (errores críticos)
          600: '#DC2626', // Hover/active de error
          700: '#B91C1C', // Estado presionado
          800: '#991B1B',
          900: '#7F1D1D', // Texto sobre error
        },
        // Text colors
        text: {
          primary: '#111827', // Títulos y párrafos principales
          secondary: '#475569', // Etiquetas, descripciones y texto de menor jerarquía
        },
        // Background colors
        bg: {
          main: '#FFFFFF', // Fondo global de página/web/app
          surface: '#FFFFFF', // Tarjetas, inputs y paneles (usa sombra/divider)
          'product-grid': '#FDE388', // Fondo sutil del grid de productos
        },
        // Divider color
        divider: '#CBD5E1', // Bordes, separadores y líneas divisorias
      },
    },
  },
  plugins: [],
};
