import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

import { AppProviders } from "@/providers/app-providers";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { JsonLd } from "@/components/seo/json-ld";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechBes | CCTV Installation & IT Services in Bangalore",
  description:
    "Book professional CCTV installation, repair, AMC, networking and IT services across Bangalore with verified technicians and transparent pricing.",
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
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd type="organization" />
        <JsonLd type="localbusiness" />
        <JsonLd type="website" />
      </head>
      <body className="font-sans antialiased">
        <AppProviders>
          {children}
          <AIAssistantWidget />
          <CookieConsent />
        </AppProviders>
        <Analytics />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

