"use client";

import { ReactNode } from "react";

import { useAuth } from "@/features/auth/context/auth-context";

export function RoleGuard({
  allow,
  children,
  fallback = null,
}: {
  allow: Array<"admin" | "user">;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
