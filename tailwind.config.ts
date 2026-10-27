import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf7f2',
          100: '#f4ede1',
          200: '#e7d8c3',
          300: '#d6bfa0',
          400: '#c4a27c',
          500: '#b48a60',
          600: '#9e7350',
          700: '#7f5940',
          800: '#674937',
          900: '#543c2f',
          950: '#2d1e17',
        },
        zen: {
          sand: '#F7F4EE',
          paper: '#FCFAF6',
          stone: '#E8E4DC',
          charcoal: '#22201E',
          muted: '#6E6B65',
          gold: '#C5A059',
          terracotta: '#C86D51',
          sage: '#8A9A86',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 30, 23, 0.06)',
        'lifted': '0 10px 30px -4px rgba(45, 30, 23, 0.1)',
        'floating': '0 20px 40px -10px rgba(45, 30, 23, 0.14)',
      }
    },
  },
  plugins: [],
};
export default config;
