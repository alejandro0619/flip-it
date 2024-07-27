import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          dark: '#210B2C',
          light: '#BC96E6',
          lighter: '#D8B4E2',
          darkenedLight: '#A46AB0',
          darkenedLighter: '#9B68D7',
        },
      },
      animation: {
        'fade-in-out': 'fadeInOut 0.5s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwindcss-animated')
  ],
};

export default config;
