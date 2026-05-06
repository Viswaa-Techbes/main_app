import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { AppProviders } from "@/providers/app-providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProviders>
          <PageTransition>{children}</PageTransition>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
