import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Error404 from "./components/Error404/Error404";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Layout from "./components/Layout/Layout";

// Pages
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import BuySell from "./pages/BuySell/BuySell";
import LostFound from "./pages/LostFound/LostFound";
import Planner from "./pages/Planner/Planner";
import Summarizer from "./pages/Summarizer/Summarizer";
import Quiz from "./pages/Quiz/Quiz";
import Profile from "./pages/Profile/Profile";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import ResourceLibrary from "./pages/ResourceLibrary/ResourceLibrary";
import ConnectToSeniors from "./components/ConnectToSeniors/ConnectToSeniors"; // Import the new component
import AddSeniorProfileForm from "./pages/AddSeniorProfile/AddSeniorProfileForm"; // Import the new form component

import "./index.css";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen w-full transition-colors relative overflow-x-hidden">
              <Routes>
                <Route
                  path="/"
                  element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />
                  }
                />
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route
                  path="/signup"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Signup />
                    )
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <>
                      <Navbar />
                      <ForgotPassword />
                    </>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buy-sell"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <BuySell />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lost-found"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <LostFound />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/planner"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Planner />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/summarizer"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Summarizer />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Quiz />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resource-library"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ResourceLibrary />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Leaderboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {/* New route for Connect to Seniors */}
                <Route
                  path="/connect-to-seniors"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ConnectToSeniors />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {/* New route for Add Senior Profile Form */}
                <Route
                  path="/add-senior-profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AddSeniorProfileForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/404"
                  element={
                    <>
                      <Navbar />
                      <Error404 />
                    </>
                  }
                />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10b981",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </div>
          </Router>
        </SocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
