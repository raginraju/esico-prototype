import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("auth_token");

  if (!token) {
    // Redirect to login while preserving intended destination
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}