import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import DentistDashboard from "./pages/DentistDashboard";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = jwtDecode(token);

        // Expiry check
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setAuth(null);
        } else {
          setAuth({ role: payload.role, id: payload.id });
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setAuth(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={auth ? `/${auth.role.toLowerCase()}` : "/login"} />} />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/technician"
          element={
            auth?.role === "Technician" ? (
              <ErrorBoundary>
                <TechnicianDashboard onLogout={handleLogout} />
              </ErrorBoundary>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dentist"
          element={
            auth?.role === "Dentist" ? (
              <ErrorBoundary>
                <DentistDashboard onLogout={handleLogout} />
              </ErrorBoundary>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
