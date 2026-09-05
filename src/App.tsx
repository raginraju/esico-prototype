// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import IDCards from "./pages/IDCards";
import Certificates from "./pages/Certificates";
import Settings from "./pages/Settings";
import ViewCertificates from "./pages/ViewCertificates";
import ViewPDF from "./pages/ViewPDF";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/viewcertificates" element={<ViewCertificates />} />
        <Route path="/viewcertificates/:id" element={<ViewCertificates />} />
        <Route path="/viewPDF/:id" element={<ViewPDF />} />

        {/* Guarded Inspector / Admin Routes under AdminLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/idcards" element={<IDCards />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}