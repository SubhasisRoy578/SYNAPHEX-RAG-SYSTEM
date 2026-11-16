/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA',
        surface: '#FFFFFF',
        'text-primary': '#20232B',
        'text-secondary': '#697180',
        border: '#E4E7EC',
        accent: {
          DEFAULT: '#6D5AE6',
          hover: '#5B48D9',
          light: '#F0EEFC',
        },
        success: {
          DEFAULT: '#16845B',
          light: '#E8F6F0',
        },
        warning: {
          DEFAULT: '#B7791F',
          light: '#FDF6E8',
        },
        error: {
          DEFAULT: '#C43D4B',
          light: '#FDF0F1',
        },
        sidebar: {
          DEFAULT: '#20232B',
          border: '#2E333F',
          active: '#2E3442',
          hover: '#292E3A',
          text: '#E4E7EC',
          muted: '#8D96A5',
        },
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
