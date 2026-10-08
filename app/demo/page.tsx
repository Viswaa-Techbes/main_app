import { Metadata } from "next";
import { DemoPageView } from "@/components/demo/demo-page-view";

export const metadata: Metadata = {
  title: "TechBes Investor Presentation & Service Flow Demo",
  description:
    "Interactive investor preview and service quotation flow demonstration for TechBes security, networking, and IT services.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return <DemoPageView />;
}
