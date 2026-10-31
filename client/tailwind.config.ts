import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          primary: '#724B68',
          deep:    '#36283B',
          muted:   '#91768B',
          light:   '#F2EBF0',
        },
        surface: {
          main:  '#F7F5F7',
          white: '#FFFFFF',
          card:  '#FFFFFF',
        },
        border: {
          main: '#E4DEE3',
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

