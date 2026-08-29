"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, Settings, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsentConfig {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<ConsentConfig>({
    essential: true,
    analytics: true,
    marketing: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("techbes_cookie_consent");
      if (!consent) {
        setShowBanner(true);
      } else {
        const parsed = JSON.parse(consent);
        setPreferences(parsed);
      }
    } catch (err) {
      console.error("Failed to read cookie consent:", err);
      setShowBanner(true);
    }
  }, []);

  if (!mounted || !showBanner) return null;

  const saveConsent = (config: ConsentConfig) => {
    try {
      localStorage.setItem("techbes_cookie_consent", JSON.stringify(config));
      setShowBanner(false);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save cookie consent:", err);
    }
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleDeclineAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  return (
    <>
      {/* ── Cookie Consent Banner ── */}
      <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                Cookie Preferences
              </h3>
              <p className="text-[10px] leading-relaxed text-slate-400 font-semibold">
                TechBes uses cookies to maintain secure sessions, personalize CCTV pricing configurations, and analyze web traffic in Bangalore. Read our{" "}
                <Link href="/cookie-policy" className="text-blue-400 hover:underline">
                  Cookie Policy
                </Link>{" "}
                for details.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 relative z-10">
            <Button
              onClick={handleAcceptAll}
              size="sm"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] px-3.5 h-9 shrink-0 flex-1"
            >
              Accept All
            </Button>
            <Button
              onClick={handleDeclineAll}
              variant="outline"
              size="sm"
              className="rounded-xl bg-transparent border-slate-850 hover:bg-slate-800 text-slate-300 font-extrabold text-[10px] px-3.5 h-9 shrink-0"
            >
              Decline
            </Button>
            <Button
              onClick={() => setShowModal(true)}
              variant="ghost"
              size="sm"
              className="rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-[10px] px-3 h-9 shrink-0"
            >
              Customize
            </Button>
          </div>
        </div>
      </div>

      {/* ── Cookie Preferences Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Settings className="h-5 w-5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Cookie Preferences</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
              Customize which cookies you permit us to store on your device. Essential session and security cookies are required to process bookings.
            </p>

            {/* Cookie Categories */}
            <div className="space-y-4">
              
              {/* Category 1: Essential */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/30">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    Essential Cookies
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-100 text-blue-700">
                      Required
                    </span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Necessary for user login sessions, tracking cart selections, and securing checkout.
                  </p>
                </div>
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Category 2: Analytics */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-800">
                    Analytics & Performance
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Helps us aggregate page visit metrics, evaluate booking system performance, and optimize location routing.
                  </p>
                </div>
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Category 3: Marketing */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-800">
                    Marketing & Personalisation
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Used to remember pricing choices, apply promotional AMC coupons, and show tailored guides.
                  </p>
                </div>
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => saveConsent(preferences)}
                className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs"
              >
                Save Preferences
              </Button>
              <Button
                onClick={() => saveConsent({ essential: true, analytics: true, marketing: true })}
                variant="outline"
                className="flex-1 h-10 rounded-xl border-slate-200 text-slate-700 font-extrabold text-xs"
              >
                Allow All
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
