import { useState, useEffect } from "react";
import { FiBell, FiX, FiCheck } from "react-icons/fi";
import { useSocket } from "../../contexts/SocketContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New message from John Doe",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      message: "Your quiz result is ready",
      time: "15 min ago",
      read: false,
    },
    {
      id: 3,
      message: "New item listed in Buy & Sell",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      message: "Revision reminder: Math exam tomorrow",
      time: "2 hours ago",
      read: true,
    },
  ]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
      return () => {
        socket.off("notification");
      };
    }
  }, [socket]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-500/30">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm text-white mb-1 font-semibold">
            Notifications
          </h3>
          <p className="text-xs text-gray-400">
            You have {unreadCount} unread notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read
                ? "bg-slate-700/50 border-slate-600/50"
                : "bg-blue-500/20 border-blue-500/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    notification.read
                      ? "text-gray-400"
                      : "text-white font-semibold"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 hover:bg-blue-500/30 rounded transition"
                    title="Mark as read"
                  >
                    <FiCheck className="w-4 h-4 text-blue-400" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 hover:bg-gray-600 rounded transition"
                  title="Delete"
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <FiBell className="w-12 h-12 mx-auto mb-2 opacity-50 text-gray-400" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
