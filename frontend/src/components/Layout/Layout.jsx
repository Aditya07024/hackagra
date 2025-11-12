import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import ChatBot from '../ChatBot/ChatBot';

export default function Layout({ children }) {
  return (
    <div className="w-full overflow-x-hidden">
      <Sidebar />
      <Navbar />
      <main className="ml-20 pt-14 sm:pt-16 min-h-screen bg-dashboard-bg w-full">
        {children}
      </main>
      <ChatBot />
    </div>
  );
}

