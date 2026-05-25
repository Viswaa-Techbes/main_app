"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { useAuth } from "@/features/auth/context/auth-context";
import { UserRole } from "@/features/auth/types/auth";
import { PageStatus } from "@/shared/components/feedback/page-status";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status === "guest") {
      const redirectTarget = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirectTarget}`);
      return;
    }

    if (status === "authenticated" && allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [allowedRoles, pathname, router, status, user]);

  if (status === "loading") {
    return <PageStatus message="Checking your access..." />;
  }

  if (status !== "authenticated") {
    return <PageStatus message="Redirecting to login..." />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <PageStatus message="Redirecting to an allowed page..." />;
  }

  return <>{children}</>;
}
