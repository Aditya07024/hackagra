import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiBookOpen, FiShoppingBag, FiSearch, FiUser, FiFolder, FiSettings } from 'react-icons/fi';

const navItems = [
  { icon: FiHome, path: '/dashboard', label: 'Dashboard' },
  { icon: FiFileText, path: '/summarizer', label: 'Summarizer' },
  { icon: FiBookOpen, path: '/quiz', label: 'Quiz' },
  { icon: FiFolder, path: '/resource-library', label: 'Resources' },
  { icon: FiShoppingBag, path: '/buy-sell', label: 'Buy/Sell' },
  { icon: FiSearch, path: '/lost-found', label: 'Lost/Found' },
  { icon: FiUser, path: '/profile', label: 'Profile' },
];

export default function BottomNavbar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 lg:hidden z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-1 text-xs font-medium transition-colors duration-200
              ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300'}`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="sr-only sm:not-sr-only">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
