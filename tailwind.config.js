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

        // Shadcn UI semantic colors - lighter modern theme
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
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
        'display': ['Lato', 'sans-serif'],
        'body': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
