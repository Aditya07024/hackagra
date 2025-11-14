import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiSearch,
  FiBookOpen,
  FiUser,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";

const navItems = [
  { icon: FiHome, path: "/dashboard", label: "Dashboard" },
  { icon: FiFileText, path: "/summarizer", label: "Summarizer" },
  { icon: FiSearch, path: "/lost-found", label: "Lost & Found" },
  { icon: FiCalendar, path: "/planner", label: "Revision Planner" },
  { icon: FiBookOpen, path: "/quiz", label: "Quiz" },
  { icon: FiUser, path: "/profile", label: "Profile" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div
      className="fixed left-0 top-0 h-screen w-64 bg-dark-blue-card shadow-lg z-40 flex flex-col pt-5 pb-6"
    >
      {/* Static Home Icon - as seen in images */}
      <div className="flex items-center justify-center h-16 mb-5">
        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
          <FiHome className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" && location.pathname === "/");
            return (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-3 rounded-lg text-dark-blue-text transition-all duration-200
                    ${
                      isActive
                        ? "bg-accent-blue text-white shadow-md"
                        : "hover:bg-dark-blue-light hover:text-white"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3
                      ${
                        isActive
                          ? "bg-white text-accent-blue"
                          : "bg-dark-blue-light text-dark-blue-text-light"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings Icon at bottom - as seen in images */}
      <div className="mt-auto px-4 py-2">
        <button className="flex items-center py-3 px-3 rounded-lg text-dark-blue-text w-full hover:bg-dark-blue-light hover:text-white transition-all duration-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-3 bg-dark-blue-light text-dark-blue-text-light">
            <FiSettings className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
