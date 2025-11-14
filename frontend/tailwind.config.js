/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dashboard background and card colors
        'dark-blue-bg': '#0B1437',
        'dark-blue-card': '#1B254B',
        'dark-blue-light': '#2D3748',
        'dark-blue-text': '#A0AEC0',
        'dark-blue-text-light': '#CBD5E0',

        // Accent colors
        'accent-blue': '#422AFB',
        'accent-blue-light': '#667EEA',
        'chart-blue': '#2B3687',

        // Existing primary colors - will be updated or removed if not needed
        'dashboard-red': '#EF4444',
        'dashboard-yellow': '#F59E0B',
        'dashboard-green': '#10B981',
        'dashboard-pink': '#F472B6',
        'dashboard-orange': '#F97316',

        // Keeping existing card colors for now, will remove if not used
        'card-pink': '#FCE7F3',
        'card-orange': '#FED7AA',
        'card-yellow': '#FEF3C7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'wavy-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30, 50 50 T100 50' stroke='%23FEF3C7' fill='none' stroke-width='2' opacity='0.3'/%3E%3C/svg%3E\")",
        'balance-gradient': 'linear-gradient(135deg, #FED7AA 0%, #FCE7F3 100%)',
      },
    },
  },
  plugins: [],
}
