import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiSearch, FiSettings, FiBell, FiUser, FiMessageCircle, FiCheck, FiX, FiCalendar, FiSun } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

// Helper to get breadcrumbs from the current path
const getBreadcrumbs = (pathname) => {
  const pathSegments = pathname.split("/").filter((segment) => segment);
  return pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    return { name: segment.charAt(0).toUpperCase() + segment.slice(1), path };
  });
};

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const [showNotifications, setShowNotifications] = useState(false); // Local state for dropdown
  const notificationsRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Mock notifications data
  const [notifications] = useState([
    { id: 1, message: "New message from John Doe", time: "2 min ago", read: false, type: "message" },
    { id: 2, message: "Your quiz result is ready", time: "15 min ago", read: false, type: "quiz" },
    { id: 3, message: "New plan created!", time: "1 hour ago", read: true, type: "plan" },
  ]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsRef]);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <nav className="fixed right-0 top-0 z-50 w-[calc(100%-256px)] bg-dark-blue-bg shadow-md border-b border-dark-blue-light py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Left side: Breadcrumbs */}
        <div className="flex flex-col">
          {location.pathname !== "/dashboard" && (
            <div className="text-sm text-dark-blue-text-light">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.path}>
                  <Link to={crumb.path} className="hover:text-white">
                    {crumb.name}
                  </Link>
                  {index < breadcrumbs.length - 1 && " / "}
                </span>
              ))}
            </div>
          )}
          <h2 className="text-white text-xl font-bold capitalize">
            {location.pathname === "/dashboard"
              ? "MindVerse"
              : breadcrumbs.length > 0
              ? breadcrumbs[breadcrumbs.length - 1].name
              : "MindVerse"}
          </h2>
        </div>

        {/* Right side: Search, Icons, User */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Type here..."
              className="bg-dark-blue-card text-dark-blue-text-light rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue-light w-64"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-blue-text-light" />
          </div>

          {/* Icons and User */}
          <div className="relative flex items-center gap-2" ref={notificationsRef}>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="p-2 rounded-full text-dark-blue-text-light hover:bg-dark-blue-light hover:text-white transition flex items-center"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="ml-1 hidden sm:inline">
                    {user?.username || "Demo User"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-dark-blue-text-light hover:bg-dark-blue-light hover:text-white transition flex items-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full text-dark-blue-text-light hover:bg-dark-blue-light hover:text-white transition flex items-center"
              >
                <FiUser className="w-5 h-5" />
                <span className="ml-1 hidden sm:inline">Sign In</span>
              </Link>
            )}

            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full text-dark-blue-text-light hover:bg-dark-blue-light hover:text-white transition relative"
            >
              <FiBell className="w-5 h-5" />
              {/* Notification count bubble */}
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-dark-blue-text-light hover:bg-dark-blue-light hover:text-white transition"
            >
              <FiSun className="w-5 h-5" />
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-dark-blue-card rounded-lg shadow-xl p-4 text-white z-50">
                <h4 className="font-bold text-lg mb-2">Notifications</h4>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-2 hover:bg-dark-blue-light rounded-lg transition-colors">
                        <div className="w-8 h-8 flex-shrink-0 bg-accent-blue-light rounded-full flex items-center justify-center relative">
                          {notification.type === "message" && <FiMessageCircle className="w-4 h-4 text-white" />}
                          {notification.type === "quiz" && <FiCheck className="w-4 h-4 text-white" />}
                          {notification.type === "plan" && <FiCalendar className="w-4 h-4 text-white" />}
                          {!notification.read && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{notification.message}</p>
                          <p className="text-dark-blue-text-light text-xs">{notification.time}</p>
                        </div>
                        <button className="ml-auto text-dark-blue-text-light hover:text-white transition"><FiX className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-blue-text-light">No new notifications.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
