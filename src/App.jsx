import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TechnicianDashboard from './components/TechnicianDashboard';
import DentistDashboard from './components/DentistDashboard';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setAuth({ token, role: payload.role });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {auth && (
          <header
            className="sticky left-2 right-2 top-0 backdrop-blur bg-white/70 shadow-md z-50 rounded-2xl"
            style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold select-none">OralVis Healthcare</h1>
                  <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded select-none">
                    {auth.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    setAuth(null);
                  }}
                  className="text-white rounded-full border-2 border-blue-600 bg-blue-600 px-3 py-1 text-sm font-semibold shadow-sm transition-colors duration-200 ease-in-out hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  aria-label="Logout"
                  type="button"
                >
                  Logout
                </button>
              </nav>
            </div>
          </header>
        )}

        <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route
              path="/login"
              element={
                !auth ? <LoginPage setAuth={setAuth} /> : <Navigate to={auth.role === 'Technician' ? '/technician' : '/dentist'} />
              }
            />
            <Route
              path="/signup"
              element={
                !auth ? <SignupPage /> : <Navigate to={auth.role === 'Technician' ? '/technician' : '/dentist'} />
              }
            />
            <Route
              path="/technician"
              element={
                auth?.role === 'Technician' ? (
                  <ErrorBoundary>
                    <TechnicianDashboard />
                  </ErrorBoundary>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/dentist"
              element={auth?.role === 'Dentist' ? <DentistDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={<Navigate to={auth ? (auth.role === 'Technician' ? '/technician' : '/dentist') : '/login'} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
