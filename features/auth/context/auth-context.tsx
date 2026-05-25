"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { logger } from "@/core/logging/logger";
import { authService } from "@/features/auth/services/auth-service";
import { AuthUser } from "@/features/auth/types/auth";

type AuthStatus = "loading" | "authenticated" | "guest";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: typeof authService.login;
  register: typeof authService.register;
  sendOtp: typeof authService.sendOtp;
  verifyOtp: typeof authService.verifyOtp;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  async function refreshSession() {
    try {
      const session = await authService.getSession();

      if (session.authenticated && session.user) {
        setUser(session.user);
        setStatus("authenticated");
        return;
      }

      setUser(null);
      setStatus("guest");
    } catch (error) {
      logger.warn("Session bootstrap failed", error);
      setUser(null);
      setStatus("guest");
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      logger.warn("Logout failed", error);
    } finally {
      setUser(null);
      setStatus("guest");
    }
  }

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      login: authService.login,
      register: authService.register,
      sendOtp: authService.sendOtp,
      verifyOtp: authService.verifyOtp,
      logout,
      refreshSession,
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
