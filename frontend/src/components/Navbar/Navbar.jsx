import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FiSun, FiMoon, FiLogOut, FiBell, FiMenu, FiUser } from "react-icons/fi";
import toast from 'react-hot-toast';

function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25);
  const [hours, setHours] = useState(0); // New state for hours
  const [minutes, setMinutes] = useState(workDuration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customInputMinutes, setCustomInputMinutes] = useState(workDuration);
  const [customInputHours, setCustomInputHours] = useState(0);
  const [isCustomInputActive, setIsCustomInputActive] = useState(false);
  const [showTimeRemainingPopup, setShowTimeRemainingPopup] = useState(false);

  useEffect(() => {
    setHours(Math.floor(workDuration / 60));
    setMinutes(workDuration % 60);
  }, [workDuration]);

  useEffect(() => {
    let interval = null;
    const totalSecondsRemaining = hours * 3600 + minutes * 60 + seconds;

    if (totalSecondsRemaining === 120 && isActive && !showTimeRemainingPopup) { // 2 minutes
      toast.error("Less than 2 minutes remaining!");
      setShowTimeRemainingPopup(true); // Set to true to prevent multiple popups
    }
    if (totalSecondsRemaining > 120 || !isActive) {
        setShowTimeRemainingPopup(false); // Reset when time is no longer critical or timer is paused
    }

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours(hours - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          setHours(Math.floor(workDuration / 60));
          setMinutes(workDuration % 60);
          setSeconds(0);
          setIsBreak(false); // Ensure it's not on break
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, hours, minutes, seconds, workDuration, showTimeRemainingPopup]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setHours(Math.floor(workDuration / 60));
    setMinutes(workDuration % 60);
    setSeconds(0);
    setIsBreak(false);
  };

  const presetTimes = [30, 60, 120]; // 30 min, 1 hr, 2 hrs

  const handlePresetTimeChange = (newDuration) => {
    setWorkDuration(newDuration);
    setIsCustomInputActive(false); // Hide custom input when a preset is selected
    if (!isActive) {
      setHours(Math.floor(newDuration / 60));
      setMinutes(newDuration % 60);
      setSeconds(0);
    }
    setShowSettings(false); // Close settings after selection
  };

  const handleCustomHoursChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCustomInputHours(value);
    const totalMinutes = value * 60 + (parseInt(customInputMinutes) || 0);
    setWorkDuration(totalMinutes);
    if (!isActive) {
      setHours(value);
      setMinutes(parseInt(customInputMinutes) || 0);
      setSeconds(0);
    }
  };

  const handleCustomMinutesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCustomInputMinutes(value);
    const totalMinutes = (parseInt(customInputHours) || 0) * 60 + value;
    setWorkDuration(totalMinutes);
    if (!isActive) {
      setHours(parseInt(customInputHours) || 0);
      setMinutes(value);
      setSeconds(0);
    }
  };

  const handleCustomButtonClick = () => {
    setIsCustomInputActive(true);
    setCustomInputHours(Math.floor(workDuration / 60));
    setCustomInputMinutes(workDuration % 60);
  };

  const formatTime = (h, m, s) => {
    const formattedHours = h.toString().padStart(2, "0");
    const formattedMinutes = m.toString().padStart(2, "0");
    const formattedSeconds = s.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const isTimeCritical = hours === 0 && minutes < 2 && isActive;

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">⏱️</span>
          <span className={`text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-mono font-semibold ${isTimeCritical ? 'text-red-500 dark:text-red-400' : ''}`}>
            {formatTime(hours, minutes, seconds)}
          </span>
        </div>
        <div className="flex items-center gap-1 border-l border-blue-300 dark:border-blue-700 pl-2 ml-1">
          <button
            onClick={toggle}
            className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-xs px-1.5 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
            title={isActive ? "Pause" : "Start"}
          >
            {isActive ? "⏸" : "▶"}
          </button>
          <button
            onClick={reset}
            className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-xs px-1.5 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
            title="Reset"
          >
            ↻
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-xs px-1.5 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      

      {showSettings && (
        <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 w-48 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Set Work Duration</h4>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {presetTimes.map((time) => (
              <button
                key={time}
                onClick={() => handlePresetTimeChange(time)}
                className={`p-2 rounded-md text-sm font-medium transition ${workDuration === time && !isCustomInputActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
              >
                {time === 60 ? '1 hr' : time === 120 ? '2 hrs' : `${time} min`}
              </button>
            ))}
            <button
              onClick={handleCustomButtonClick}
              className={`p-2 rounded-md text-sm font-medium transition ${isCustomInputActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'}`}
            >
              Custom
            </button>
          </div>
          {isCustomInputActive && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="custom-hours" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hours</label>
                <input
                  type="number"
                  id="custom-hours"
                  value={customInputHours}
                  onChange={handleCustomHoursChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="custom-minutes" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Minutes</label>
                <input
                  type="number"
                  id="custom-minutes"
                  value={customInputMinutes}
                  onChange={handleCustomMinutesChange}
                  min="0"
                  max="59"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ toggleSidebar }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-3 sm:px-6 flex items-center justify-between h-14 sm:h-16 ml-0 lg:ml-0">
        {/* Sidebar Toggle Button for small screens - Reintroduced for lg:hidden */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 mr-2"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <FiMenu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/dashboard" className="flex items-center">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-base sm:text-lg md:text-xl tracking-tight hover:from-blue-700 hover:to-purple-700 transition-all whitespace-nowrap">
              MindVerse
            </span>
          </Link>
        </div>
        {/* Right side - Pomodoro Timer, Theme toggle and Auth buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-auto">
          {/* Pomodoro Timer */}
          <div className="hidden lg:block flex-shrink-0">
            <PomodoroTimer />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 flex-shrink-0"
            aria-label="Toggle theme"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <FiSun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <FiMoon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/profile"
                className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 flex-shrink-0"
                title={user?.username || "Profile"}
              >
                <FiUser className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-xs font-medium whitespace-nowrap flex-shrink-0"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
