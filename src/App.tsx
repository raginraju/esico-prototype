// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewCertificates from "./pages/ViewCertificates";
import ViewPDF from "./pages/ViewPDF";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Certificate Inspection (QR Code Scans) */}
        <Route path="/viewcertificates" element={<ViewCertificates />} />
        <Route path="/viewcertificates/:id" element={<ViewCertificates />} />

        {/* PDF Viewer */}
        <Route path="/viewPDF/:id" element={<ViewPDF />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}