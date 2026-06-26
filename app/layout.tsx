import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Techbes Marketplace | Book Verified IT Experts",
  description:
    "A modern IT service marketplace for CCTV, networking, laptop, desktop, server setup, electronic contracts, home automation, website development, software licensing, and cyber security.",
  generator: "OpenAI Codex",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
        <Analytics />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
