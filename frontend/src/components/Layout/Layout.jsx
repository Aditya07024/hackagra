import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-dark-blue-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
      <Navbar />
        <main className="flex-1 ml-64 pt-20 px-6 pb-6">
        {children}
      </main>
      </div>
    </div>
  );
}

