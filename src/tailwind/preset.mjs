import animate from 'tailwindcss-animate'

/**
 * Tailwind preset that maps utilities (bg-primary, text-muted-foreground,
 * rounded-md, …) onto the CSS-variable token contract defined in
 * `../css/tokens.css`. Consumer config supplies its own `content` globs.
 *
 * @type {Partial<import('tailwindcss').Config>}
 */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--surface-default))',
        foreground: 'hsl(var(--text-color-default))',
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--text-color-default))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--surface-secondary))',
          foreground: 'hsl(var(--text-color-default))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--text-color-default))',
        },
        muted: {
          DEFAULT: 'hsl(var(--surface-muted))',
          foreground: 'hsl(var(--text-color-muted))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--text-color-default))',
        },
        popover: {
          DEFAULT: 'hsl(var(--surface-raised))',
          foreground: 'hsl(var(--text-color-default))',
        },
        card: {
          DEFAULT: 'hsl(var(--surface-raised))',
          foreground: 'hsl(var(--text-color-default))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [animate],
}
