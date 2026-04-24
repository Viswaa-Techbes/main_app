import { ReactNode } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { PageShell } from "@/components/layout/page-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <PageShell>{children}</PageShell>
    </ProtectedRoute>
  );
}
