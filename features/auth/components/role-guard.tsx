"use client";

import { ReactNode } from "react";

import { useAuth } from "@/features/auth/context/auth-context";
import { UserRole } from "@/features/auth/types/auth";

export function RoleGuard({
  allow,
  children,
  fallback = null,
}: {
  allow: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
