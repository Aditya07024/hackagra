import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiSearch,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiSettings,
  FiX,
  FiFolder,
} from "react-icons/fi";

const navItems = [
  { icon: FiHome, path: "/dashboard", label: "Dashboard" },
  { icon: FiFileText, path: "/summarizer", label: "Smart Summarizer" },
  { icon: FiBookOpen, path: "/quiz", label: "Quiz" },
  { icon: FiFolder, path: "/resource-library", label: "Resource Library" },
  { icon: FiShoppingBag, path: "/buy-sell", label: "Buy & Sell" },
  { icon: FiSearch, path: "/lost-found", label: "Lost & Found" },
];

export default function Sidebar({ isSidebarOpen, toggleSidebar, isSidebarHovered, handleMouseEnter, handleMouseLeave }) {
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-40 flex flex-col items-center pt-14 sm:pt-16 pb-4 sm:pb-6 transition-all duration-300
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'} // Small screen: open/close with full width
          lg:translate-x-0 ${isSidebarHovered ? 'lg:w-56' : 'lg:w-14'} // Large screen: hover expands to w-56, collapsed is w-14
          dark:bg-blue-900/40 dark:backdrop-blur-md dark:backdrop-filter dark:border-r dark:border-blue-700 dark:shadow-xl-dark
          ${!isSidebarOpen && 'hidden lg:flex'} // Hide on small screens when closed, but keep flex on large screens
        `}
        onMouseEnter={window.innerWidth >= 1024 ? handleMouseEnter : undefined} // Only enable hover on large screens
        onMouseLeave={window.innerWidth >= 1024 ? handleMouseLeave : undefined} // Only enable hover on large screens
      >
        {/* Close button for small screens - visible only when sidebar is open (clicked) */}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-2 sm:gap-2 pt-3 lg:gap-3 lg:pt-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" && location.pathname === "/");
            return (
              <div key={item.path} className="relative group/item w-full">
                <Link
                  to={item.path}
                  className={`rounded-lg flex items-center transition-all h-10
                    ${isSidebarOpen || isSidebarHovered ? 'justify-start px-2 w-full' : 'justify-center w-10'}
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md dark:bg-blue-600 dark:shadow-lg-dark"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  onClick={toggleSidebar} // Close sidebar on item click
                >
                  <Icon className="w-5 h-5" />
                  {(isSidebarOpen || isSidebarHovered) && (
                    <span className="ml-3 text-sm font-medium whitespace-nowrap dark:text-gray-100">
                      {item.label}
                    </span>
                  )}
                </Link>
                {/* Tooltip (hidden when sidebar is open or hovered) */}
                {!(isSidebarOpen || isSidebarHovered) && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none dark:bg-blue-700 dark:text-blue-100">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent dark:border-r-blue-700"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Profile at bottom */}
        <div className="mt-auto relative group/item w-full">
          <Link
            to="/profile"
            className={`rounded-lg flex items-center transition-all h-10
              ${isSidebarOpen || isSidebarHovered ? 'justify-start px-2 w-full' : 'justify-center w-10'}
              text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`}
            onClick={toggleSidebar} // Close sidebar on profile click
          >
            <FiUser className="w-5 h-5" />
            {(isSidebarOpen || isSidebarHovered) && (
              <span className="ml-3 text-sm font-medium whitespace-nowrap dark:text-gray-100">
                Profile
              </span>
            )}
          </Link>
          {/* Tooltip (hidden when sidebar is open or hovered) */}
          {!(isSidebarOpen || isSidebarHovered) && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none dark:bg-blue-700 dark:text-blue-100">
              Profile
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent dark:border-r-blue-700"></div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar} // Close sidebar when clicking overlay
        ></div>
      )}
    </>
  );
}
