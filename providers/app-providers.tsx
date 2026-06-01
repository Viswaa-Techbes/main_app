"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/features/auth/context/auth-context";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}<Toaster /></AuthProvider>;
}
