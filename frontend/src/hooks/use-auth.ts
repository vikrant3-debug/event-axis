import { getAuth, clearAuth, isAuthenticated as checkAuth } from "@/lib/auth";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return {
    isAuthenticated: checkAuth(),
    isLoading: false,
    user: auth ? { access_token: auth.token, email: auth.email, role: auth.role } : null,
    token: auth?.token ?? null,
    email: auth?.email ?? null,
    role: auth?.role ?? null,
    logout,
  };
};
