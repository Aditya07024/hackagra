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
        // Primary colors from the dashboard
        'dashboard-red': '#EF4444',
        'dashboard-yellow': '#F59E0B',
        'dashboard-green': '#10B981',
        'dashboard-bg': '#FEF9E7', // Light beige/yellow background
        'dashboard-pink': '#F472B6',
        'dashboard-orange': '#F97316',
        // Card colors
        'card-pink': '#FCE7F3',
        'card-orange': '#FED7AA',
        'card-yellow': '#FEF3C7',
        'beige': '#F5F5DC',
      },
      backgroundImage: {
        'wavy-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30, 50 50 T100 50' stroke='%23FEF3C7' fill='none' stroke-width='2' opacity='0.3'/%3E%3C/svg%3E\")",
        'balance-gradient': 'linear-gradient(135deg, #FED7AA 0%, #FCE7F3 100%)',
      },
      boxShadow: {
        'xl-dark': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        '2xl-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
