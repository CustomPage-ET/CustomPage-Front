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
          primary: 'var(--color-brand-primary)',
          accent: 'var(--color-brand-accent)',
          dark: 'var(--color-text-dark)',
          muted: 'var(--color-text-muted)',
          card: 'var(--color-card)'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(99, 102, 241, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
};
export default config;