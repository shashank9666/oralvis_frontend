import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Corrected import

import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import TechnicianDashboard from "./components/TechnicianDashboard";
import DentistDashboard from "./components/DentistDashboard";

const App = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { exp, role, id } = jwtDecode(token);
        if (exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setAuth(null);
        } else {
          setAuth({ role, id });
        }
      } catch {
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!auth ? <LoginPage setAuth={setAuth} /> : <Navigate to={`/${auth.role.toLowerCase()}`} />}
        />
        <Route
          path="/signup"
          element={!auth ? <SignupPage setAuth={setAuth}/> : <Navigate to={`/${auth.role.toLowerCase()}`} />}
        />
        <Route
          path="/technician"
          element={auth?.role === "Technician" ? (
            <TechnicianDashboard logout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route
          path="/dentist"
          element={auth?.role === "Dentist" ? (
            <DentistDashboard logout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
