import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const LoginPage = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/api/login", credentials);
      localStorage.setItem("token", data.token);
      setAuth(null); // App.jsx will decode token
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>

        {error && <div className="text-red-600 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-600 mr-1">Don't have an account?</span>
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-900 font-medium"
          >
            Create an account
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Demo Credentials:
          <br />Technician: technician@oralvis.com / password123
          <br />Dentist: dentist@oralvis.com / password123
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
