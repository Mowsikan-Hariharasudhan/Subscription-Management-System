import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        odoo: {
          DEFAULT: '#714B67',
          dark:    '#4A3043',
          light:   '#8E627F',
          glow:    'rgba(113, 75, 103, 0.4)',
        },
        plum: {
          primary: '#714B67',
          deep:    '#4A3043',
          muted:   '#91768B',
          light:   '#F2EBF0',
        },
        surface: {
          main:  '#F7F5F8',
          white: '#FFFFFF',
          card:  '#FFFFFF',
        },
        border: {
          main: '#000000',
          subtle: '#E4DEE3',
        },
        text: {
          primary:   '#29242B',
          secondary: '#746F75',
        },
        accent: {
          info: '#D1ECF1',
        },
      },
    },
  },
  plugins: [],
};

export default config;
