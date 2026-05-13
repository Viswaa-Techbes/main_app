import { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import Navbar from "@/components/layout/navbar";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
