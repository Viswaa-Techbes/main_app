import { ReactNode } from "react";

import { NewsletterBanner, SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <NewsletterBanner />
      <SiteFooter />
    </div>
  );
}
