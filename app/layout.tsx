import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import { AppProviders } from "@/providers/app-providers";
import "@/components/design-system/design-tokens.css";
import ThemeSwitcher from "@/components/ui/theme-switcher";
import CommandPalette from "@/components/ui/command-palette";

import "./globals.css";

export const metadata: Metadata = {
  title: "Techbes Marketplace | Book Verified IT Experts",
  description:
    "A modern IT service marketplace for CCTV installation, networking, cyber security, repair, and AMC plans.",
  generator: "OpenAI Codex",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

import { PageTransition } from "@/components/layout/page-transition";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" data-scroll-behavior="smooth">
        <AppProviders>
          <div style={{ minHeight: '100vh' }}>
            <ThemeSwitcher className="absolute right-6 top-6 z-40" />
            <CommandPalette />
            <PageTransition>{children}</PageTransition>
            <MobileBottomNav />
          </div>
        </AppProviders>
        <Analytics />

        {process.env.NODE_ENV === "production" && (
          <Script id="ga-domain-loader" strategy="afterInteractive">
            {`(function(){
  try{
    var mapping = {
      "techbes.co.in": "${process.env.NEXT_PUBLIC_GA_MAIN || ""}",
      "www.techbes.co.in": "${process.env.NEXT_PUBLIC_GA_MAIN || ""}",
      "skills.techbes.co.in": "${process.env.NEXT_PUBLIC_GA_SKILLS || ""}",
      "members.techbes.co.in": "${process.env.NEXT_PUBLIC_GA_MEMBERS || ""}",
      "localhost": "${process.env.NEXT_PUBLIC_GA_MAIN || ""}"
    };
    var host = window.location.hostname;
    var id = mapping[host] || mapping[host.replace(/^www\./,"")] || "${process.env.NEXT_PUBLIC_GA_MAIN || ""}";
    if(!id) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', id, { send_page_view: true });
  }catch(e){console.error('GA init error', e)}
})();`}
          </Script>
        )}
      </body>
    </html>
  );
}
