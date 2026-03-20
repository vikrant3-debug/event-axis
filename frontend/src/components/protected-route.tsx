import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { isAuthenticated } from "@/lib/auth";

interface ProtectedRouteProperties {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProperties> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    localStorage.setItem("redirectPath", location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
