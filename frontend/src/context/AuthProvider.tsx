import React, { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../api/api";
import type { AuthUser } from "../api/types";

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";

function loadToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(loadToken);
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const persist = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      const data = await api.auth.login(loginValue, password);
      persist(data.token, data.user);
    },
    [persist],
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const data = await api.auth.register(username, email, password);
      persist(data.token, data.user);
    },
    [persist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: token !== null,
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
