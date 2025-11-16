import { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar'; // Reintroduce Sidebar import
import Navbar from '../Navbar/Navbar';
import ChatBot from '../ChatBot/ChatBot';
import BottomNavbar from '../BottomNavbar/BottomNavbar';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Reintroduce state
  const [isSidebarHovered, setIsSidebarHovered] = useState(false); // Reintroduce state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMouseEnter = () => {
    setIsSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarHovered(false);
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isSidebarHovered={isSidebarHovered}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>

      <Navbar toggleSidebar={toggleSidebar} />
      <main
        className={`min-h-screen bg-dashboard-bg dark:bg-blue-950/80 dark:backdrop-blur-lg dark:backdrop-filter w-full transition-all duration-300
          ${isSidebarOpen ? 'ml-64' : 'ml-0'} // Small screen: adjust margin based on open state
          ${isSidebarHovered ? 'lg:ml-56' : 'lg:ml-14'} // Large screen: adjust margin based on hovered state (w-14 = 3.5rem, w-56 = 14rem)
          ${isSidebarHovered ? 'lg:w-[calc(100%-14rem)]' : 'lg:w-[calc(100%-3.5rem)]'}`} // Adjust width for sidebar (3.5rem = w-14, 14rem = w-56)
      >
        {children}
      </main>
      <ChatBot />
      {/* Bottom Navbar for small screens */}
      <div className="lg:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
}

