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
          light:   '#F5EEF3',
          surface: '#FAF2F7',
        },
        surface: {
          main:  '#F7F5F8',
          white: '#FFFFFF',
          card:  '#FFFFFF',
          subtle:'#F5F3F4',
        },
        border: {
          main: '#000000',
          subtle: '#E4DEE3',
        },
        text: {
          primary:   '#242424',
          secondary: '#746F75',
          muted:     '#9E999F',
        },
        accent: {
          info: '#D1ECF1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'brutal-xs': '1px 1px 0px rgba(36,36,36,0.08)',
        'brutal-sm': '2px 2px 0px rgba(36,36,36,0.12)',
        'brutal-plum': '2px 2px 0px #724B68',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
      },
    },
  },
  plugins: [],
};

export default config;
