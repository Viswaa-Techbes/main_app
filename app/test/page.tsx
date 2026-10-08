import { Metadata } from "next";
import { DemoPageView } from "@/components/demo/demo-page-view";

export const metadata: Metadata = {
  title: "TechBes Customer Flow Test & Preview",
  description:
    "Interactive test preview and service quotation flow demonstration for TechBes security, networking, and IT services.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestPage() {
  return <DemoPageView />;
}
