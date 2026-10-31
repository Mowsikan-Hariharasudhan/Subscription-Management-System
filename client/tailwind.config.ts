import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          primary: '#6A3D5B',    // Primary Brand Plum
          hover: '#552F48',      // Darker plum on hover
          deep: '#3E2134',       // Deep plum for structural accents
          muted: '#8A5F7C',      // Muted plum text
          surface: '#F8F0F5',    // Soft plum surface tint
          border: '#E8DCE5',     // Plum border
        },
        surface: {
          main: '#FAF7F5',       // Warm canvas background
          card: '#FFFFFF',       // Pure white card background
          subtle: '#F6F3F5',     // Subtle row background
          hover: '#F8F2F6',      // Hover background
        },
        border: {
          main: '#E5DFE4',       // Crisp structural 1px border
          dark: '#3E2134',       // High-contrast outline for accents
          light: '#F0EAF0',
          focus: '#6A3D5B',
        },
        text: {
          primary: '#1F1A1E',    // High-contrast charcoal text
          secondary: '#756C73',  // Refined slate secondary text
          muted: '#9E949B',      // Metadata / subtle text
        },
        accent: {
          emerald: '#059669',
          amber: '#D97706',
          rose: '#DC2626',
          cyan: '#0891B2',
          indigo: '#4F46E5',
        },
      },
      borderRadius: {
        '2xl': '14px',
        '3xl': '20px',
        xl: '10px',
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        xs: '1px 1px 0px rgba(45, 30, 40, 0.08)',
        sm: '2px 2px 0px rgba(45, 30, 40, 0.06)',
        card: '2px 2px 0px #E5DFE4',
        'card-interactive': '3px 3px 0px #D8CFD7',
        'plum-btn': '2px 2px 0px #3E2134',
        'outline-btn': '2px 2px 0px #E5DFE4',
        elevated: '4px 4px 0px #E5DFE4',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
