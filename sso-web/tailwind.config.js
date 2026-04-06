/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E85A2A',
        'bg-dark': '#0D1117',
        'bg-card': '#161B22',
        'bg-elevated': '#1C2128',
        'risk-high': '#FF4757',
        'risk-medium': '#FFA502',
        'risk-low': '#2ED573',
        'text-primary': '#F0F6FC',
        'text-secondary': '#8B949E',
        'border': '#30363D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
      },
      spacing: {
        'sidebar-width': '256px',
      },
    },
  },
  plugins: [],
};
