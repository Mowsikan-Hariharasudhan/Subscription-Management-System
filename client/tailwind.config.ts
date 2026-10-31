import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          primary: '#6A3D5B',    // Primary Brand Plum from reference
          hover: '#552F48',      // Darker plum on button hover
          deep: '#3E2134',       // Deep plum for gradients / hero
          muted: '#8A5F7C',      // Muted plum text / secondary
          surface: '#F8F0F5',    // Light plum tint for icon boxes & active pills
          border: '#EAE0E7',     // Soft plum border
        },
        surface: {
          main: '#FAF7F5',       // Warm porcelain background from reference
          card: '#FFFFFF',       // Pure white card background
          subtle: '#F6F3F5',     // Subtle row & table header background
          hover: '#F8F2F6',      // Hover row / button background
        },
        border: {
          main: '#EAE4E8',       // Crisp 1px border matching reference
          light: '#F2EDF0',
          focus: '#6A3D5B',
        },
        text: {
          primary: '#1F1A1E',    // Dark charcoal primary text
          secondary: '#756C73',  // Refined slate secondary text
          muted: '#9E949B',      // Placeholder / subtle text
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
        '2xl': '16px',
        '3xl': '24px',
        xl: '12px',
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(45, 30, 40, 0.04)',
        card: '0 2px 8px rgba(45, 30, 40, 0.03), 0 1px 3px rgba(45, 30, 40, 0.05)',
        elevated: '0 10px 25px -5px rgba(45, 30, 40, 0.07), 0 8px 10px -6px rgba(45, 30, 40, 0.05)',
        subtle: '0 1px 2px rgba(0, 0, 0, 0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
