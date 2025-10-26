import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
