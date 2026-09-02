import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ViewCertificates from "./pages/ViewCertificates";
import ViewPDF from "./pages/ViewPDF";
import Portal from "./pages/Portal";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Homepage: Sign In Screen */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Public Certificate Verification Screens */}
        <Route path="/viewcertificates" element={<ViewCertificates />} />
        <Route path="/viewPDF/:id" element={<ViewPDF />} />

        {/* Internal Inspector Portal */}
        <Route path="/portal" element={<Portal />} />

        {/* Catch-all: Redirect unknown paths back to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}