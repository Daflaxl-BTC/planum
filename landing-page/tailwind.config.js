/** @type {import('tailwindcss').Config} */

// Farbtokens. Die terra-Werte stammen direkt aus den Druckvektoren
// (docs/sticker-variants-d/svg/d2-terracotta-relief-profil.svg) — die Seite
// traegt die Farbe des physischen Produkts. "night" ist ein fast schwarzes
// Moosgruen fuer die dunklen Buehnen: dunkel genug fuer Kontrast, aber nie
// neutrales Grau, damit der Terracotta-Ton warm bleibt.

export default {
  content: [
    './index.html',
    './impressum.html',
    './datenschutz.html',
    './danke.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#101813',
          70: 'rgba(16, 24, 19, 0.7)',
          50: 'rgba(16, 24, 19, 0.5)',
        },
        paper: {
          DEFAULT: '#FAF8F3',
          deep: '#F2EEE4',
        },
        night: {
          DEFAULT: '#0B110D',
          800: '#0F1712',
          700: '#142019',
          600: '#1B2a21',
        },
        terra: {
          100: '#F6E2D3',
          300: '#E3A27A',
          400: '#D89268',
          500: '#C97B52',
          700: '#96522F',
        },
        moss: {
          50: '#f2f7f2',
          100: '#e0ece0',
          200: '#c3d9c3',
          300: '#98bc98',
          400: '#6b9b6b',
          500: '#4a7f4a',
          600: '#386538',
          700: '#2e512e',
          800: '#274227',
          900: '#213621',
        },
        mint: '#9FDCB4',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.9rem, 6vw, 5.6rem)', { lineHeight: '0.95', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(2.5rem, 5.4vw, 4.75rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
        h2: ['clamp(2.125rem, 4.2vw, 3.5rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        h3: ['clamp(1.2rem, 1.6vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        lead: ['clamp(1.0625rem, 1.4vw, 1.3rem)', { lineHeight: '1.55', letterSpacing: '-0.01em' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        small: ['0.9375rem', { lineHeight: '1.55' }],
        micro: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        note: ['0.8125rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        xs: '2px',
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '28px',
      },
      maxWidth: {
        measure: '62ch',
        'measure-tight': '48ch',
      },
      spacing: {
        18: '4.5rem',
        section: '6rem',
        'section-lg': '8rem',
        'section-xl': '10rem',
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(.22,1,.36,1)',
      },
      transitionDuration: {
        reveal: '640ms',
      },
      boxShadow: {
        product: '0 1px 2px rgba(16,24,19,.10), 0 18px 42px -18px rgba(16,24,19,.32)',
        card: '0 1px 0 rgba(255,255,255,.04) inset, 0 30px 60px -30px rgba(0,0,0,.6)',
        glow: '0 0 0 1px rgba(227,162,122,.35), 0 20px 80px -20px rgba(201,123,82,.55)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(.6)', opacity: '0' },
          '30%': { opacity: '.9' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(.22,1,.36,1) infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
