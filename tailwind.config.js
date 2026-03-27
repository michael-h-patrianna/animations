/** @type {import('tailwindcss').Config} */
export default {
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

        // Shadcn UI semantic colors — defined via @theme inline in App.css (oklch values).
        // Raw var() references here for fallback; @theme inline takes precedence in Tailwind v4.
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      // Background gradients
      backgroundImage: {
        'brand-gradient': 'var(--pf-brand-gradient)',
        'sweep-gradient': 'var(--pf-sweep-gradient)',
        'gold-gradient': 'var(--pf-gold-gradient)',
      },
      // Border radius using your design tokens
      borderRadius: {
        xs: 'var(--pf-radius-xs)',
        sm: 'var(--pf-radius-sm)',
        md: 'var(--pf-radius-md)',
        lg: 'var(--pf-radius-lg)',
        pill: 'var(--pf-radius-pill)',
      },
      // Transition durations
      transitionDuration: {
        fast: 'var(--pf-transition-fast)',
        base: 'var(--pf-transition-base)',
        slow: 'var(--pf-transition-slow)',
      },
      // Spacing
      spacing: {
        grid: 'var(--pf-grid-gap)',
      },
      // Box shadows
      boxShadow: {
        elevated: 'var(--pf-shadow-elevated)',
        soft: 'var(--pf-shadow-soft)',
        inner: 'var(--pf-shadow-inner)',
      },
      // Font families
      fontFamily: {
        display: ['Lato', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
