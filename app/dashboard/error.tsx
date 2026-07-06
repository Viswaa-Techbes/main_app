"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <Card className="max-w-md p-8 shadow-sm border-rose-100 bg-rose-50/30 rounded-2xl">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while trying to load your dashboard data. 
          {error.message && <span className="block mt-2 text-sm font-mono text-rose-500 bg-white p-2 rounded border border-rose-100">{error.message}</span>}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
          >
            <RefreshCw size={18} />
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            Go to Home
          </button>
        </div>
      </Card>
    </div>
  );
}
