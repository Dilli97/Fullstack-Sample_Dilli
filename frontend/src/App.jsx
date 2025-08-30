import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Manage from "./pages/Manage";
import { useAuthContext } from "./context/AuthContext";

export default function App() {
  const { user } = useAuthContext();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/employees" element={user ? <Employees /> : <Navigate to="/login" />} />
      <Route path="/manage" element={user ? <Manage /> : <Navigate to="/login" />} />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
