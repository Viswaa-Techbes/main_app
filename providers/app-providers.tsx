"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/features/auth/context/auth-context";
export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
