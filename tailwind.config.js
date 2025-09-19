/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base color palette
        base: {
          0: 'var(--pf-base-0)',
          5: 'var(--pf-base-5)',
          10: 'var(--pf-base-10)',
          20: 'var(--pf-base-20)',
          30: 'var(--pf-base-30)',
          40: 'var(--pf-base-40)',
          50: 'var(--pf-base-50)',
          60: 'var(--pf-base-60)',
          70: 'var(--pf-base-70)',
          95: 'var(--pf-base-95)',
        },
        // Brand colors
        brand: {
          primary: 'var(--pf-brand-accent-primary)',
          secondary: 'var(--pf-brand-accent-secondary)',
        },
        // Text colors
        text: {
          primary: 'var(--pf-text-primary)',
          secondary: 'var(--pf-text-secondary)',
          tertiary: 'var(--pf-text-tertiary)',
        },
        // Surface colors
        surface: {
          DEFAULT: 'var(--pf-surface)',
          strong: 'var(--pf-surface-strong)',
        },
        overlay: 'var(--pf-overlay)',
        white: 'var(--pf-white)',
      },
      // Background gradients
      backgroundImage: {
        'brand-gradient': 'var(--pf-brand-gradient)',
        'sweep-gradient': 'var(--pf-sweep-gradient)',
        'gold-gradient': 'var(--pf-gold-gradient)',
      },
      // Border radius using your design tokens
      borderRadius: {
        'xs': 'var(--pf-radius-xs)',
        'sm': 'var(--pf-radius-sm)',
        'md': 'var(--pf-radius-md)',
        'lg': 'var(--pf-radius-lg)',
        'pill': 'var(--pf-radius-pill)',
      },
      // Transition durations
      transitionDuration: {
        'fast': 'var(--pf-transition-fast)',
        'base': 'var(--pf-transition-base)',
        'slow': 'var(--pf-transition-slow)',
      },
      // Spacing
      spacing: {
        'grid': 'var(--pf-grid-gap)',
      },
      // Box shadows
      boxShadow: {
        'elevated': 'var(--pf-shadow-elevated)',
        'soft': 'var(--pf-shadow-soft)',
        'inner': 'var(--pf-shadow-inner)',
      },
      // Font families
      fontFamily: {
        'display': ['Days One', 'Lato', 'sans-serif'],
        'body': ['Lato', 'helvetica', 'arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
