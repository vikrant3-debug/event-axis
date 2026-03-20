
export interface AuthUser {
  token: string;
  email: string;
  role: string;
}

export const saveAuth = (user: AuthUser) => {
  localStorage.setItem("auth_token", user.token);
  localStorage.setItem("auth_email", user.email);
  localStorage.setItem("auth_role", user.role);
};

export const getAuth = (): AuthUser | null => {
  const token = localStorage.getItem("auth_token");
  const email = localStorage.getItem("auth_email");
  const role = localStorage.getItem("auth_role");
  if (!token || !email || !role) return null;
  return { token, email, role };
};

export const clearAuth = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_email");
  localStorage.removeItem("auth_role");
};

export const isAuthenticated = (): boolean => {
  return !!getAuth();
};
