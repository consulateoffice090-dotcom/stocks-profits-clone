export default {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#6366F1',
        warning: '#F59E0B',
        danger: '#EF4444',
        dark: {
          100: '#374151',
          200: '#1F2937',
          300: '#111827',
          400: '#0F172A',
          500: '#0B1120',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
}
