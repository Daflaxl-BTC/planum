/** @type {import('tailwindcss').Config} */

// Farbtokens: ink/paper ersetzen sage als Text- und Flaechenfarbe (sage-900 war
// im Fliesstext zu gruenstichig). Die terra-Werte sind KEINE Erfindung, sondern
// direkt aus docs/sticker-variants-d/svg/d2-terracotta-relief-profil.svg
// entnommen — die Seite traegt damit die Farbe des physischen Produkts.

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
          DEFAULT: '#14201A',
          70: 'rgba(20, 32, 26, 0.7)',
          50: 'rgba(20, 32, 26, 0.5)',
        },
        paper: {
          DEFAULT: '#FBF9F4',
          deep: '#F4F1E8',
        },
        terra: {
          300: '#D89268',
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
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Fluide Skala. Der Sprung Headline -> Body ist bewusst gross;
        // gleichmaessige Groessen sind das Hauptmerkmal generischer Seiten.
        'display-xl': ['clamp(3rem, 7.5vw, 6.75rem)', { lineHeight: '0.94', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.5rem, 5.5vw, 4.5rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        h2: ['clamp(2rem, 4vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        h3: ['clamp(1.25rem, 1.8vw, 1.625rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        lead: ['clamp(1.125rem, 1.5vw, 1.375rem)', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        small: ['0.9375rem', { lineHeight: '1.55' }],
        // micro traegt 0.08em Sperrung — die stimmt fuer Versalien-Eyebrows,
        // nicht fuer ganze Saetze. Fussnoten/Consent nutzen daher `note`.
        micro: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        note: ['0.8125rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        // Bewusst nur drei Stufen. rounded-full ausschliesslich am Primaer-CTA.
        xs: '2px',
        sm: '4px',
        md: '10px',
      },
      maxWidth: {
        measure: '66ch',
        'measure-tight': '52ch',
      },
      spacing: {
        // Sektionsrhythmus variiert bewusst statt ueberall py-32.
        18: '4.5rem',
        section: '6rem',
        'section-lg': '8rem',
        'section-xl': '10rem',
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(.22,1,.36,1)',
      },
      transitionDuration: {
        reveal: '480ms',
      },
      boxShadow: {
        // Genau ein realistischer Zwei-Layer-Schatten, nur am Produktbild.
        product: '0 1px 2px rgba(20,32,26,.10), 0 18px 42px -18px rgba(20,32,26,.32)',
      },
    },
  },
  plugins: [],
}
