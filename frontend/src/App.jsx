import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
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
import ConnectToSeniors from "./pages/ConnectToSeniors/ConnectToSeniors";

import "./index.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="min-h-screen w-full transition-colors relative overflow-x-hidden">
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/login"
                    element={<Login />}
                  />
                  <Route
                    path="/signup"
                    element={<Signup />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                  />

                  {/* Authenticated routes with Layout (Sidebar + Navbar) */}
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
                    path="/tables"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          {/* Placeholder for Tables Page Content */}
                          <div className="text-white">Tables Page Content</div>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          {/* Placeholder for Billing Page Content */}
                          <div className="text-white">Billing Page Content</div>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/rtl"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          {/* Placeholder for RTL Page Content */}
                          <div className="text-white">RTL Page Content</div>
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
                    path="/sign-in"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Login /> {/* Re-using Login component for sign-in for now */}
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sign-up"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Signup /> {/* Re-using Signup component for sign-up for now */}
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  {/* Existing protected routes */}
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
                    path="/leaderboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Leaderboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ResourceLibrary />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
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

                  {/* 404 Route */}
                  <Route
                    path="/404"
                    element={<Error404 />}
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
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
