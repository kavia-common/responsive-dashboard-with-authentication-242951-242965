import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api, getAuthToken, setAuthToken } from "../api/client";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and methods to the app. */
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => {
    // Best-effort: in this template we only persist token; user can be refetched later.
    return token ? { email: "user" } : null;
  });

  const isAuthenticated = !!token;

  const login = useCallback(async ({ email, password }) => {
    const data = await api.login({ email, password });
    const accessToken = data.access_token || data.token || data.accessToken || "demo-token";
    setAuthToken(accessToken);
    setToken(accessToken);
    setUser(data.user || { email });
    return data;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await api.register({ name, email, password });
    return data;
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, register, logout }),
    [token, user, isAuthenticated, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
