/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        'border-mid': 'var(--border-mid)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-dim': 'var(--text-dim)',
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        'accent-contrast': 'var(--accent-contrast)',
      },
      fontFamily: {
        sans: ['Asap Condensed', 'sans-serif'],
      },
      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: '1.2' }],
        sm: ['var(--font-size-sm)', { lineHeight: '1.8' }],
        md: ['var(--font-size-md)', { lineHeight: '1.2' }],
        lg: ['var(--font-size-lg)', { lineHeight: '1.2' }],
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
      },
      transitionDuration: {
        DEFAULT: 'var(--motion)',
      },
    },
  },
  plugins: [],
};
