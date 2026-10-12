"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Building2, Home, KeyRound, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

function ResidentActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    const qPhone = searchParams.get("phone");
    const qCode = searchParams.get("code");
    if (qPhone) setPhone(qPhone);
    if (qCode) setActivationCode(qCode);
  }, [searchParams]);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!phone || phone.trim().length < 10) {
      return setError("Please enter a valid 10-digit mobile number.");
    }
    if (!activationCode || activationCode.trim().length !== 6) {
      return setError("Please enter the 6-digit activation code provided by your society admin.");
    }
    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match. Please re-enter.");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v2/apartments/residents/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          activationCode: activationCode.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Activation failed. Please check the code and try again.");
      }

      // Store tokens
      if (data.data?.token) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.data.token);
        localStorage.setItem("techbes_auth_token", data.data.token);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("accessToken", data.data.token);
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }
      }

      setSuccessData(data.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during activation.");
    } finally {
      setLoading(false);
    }
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 rounded-3xl shadow-xl bg-white border border-emerald-100 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Account Activated!</h1>
            <p className="text-sm text-gray-600">
              Welcome, <strong>{successData.resident?.name || successData.user?.name}</strong>! Your resident portal account is now active.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-left text-xs space-y-2 text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <Building2 size={16} />
              <span>{successData.apartment?.name || "Apartment Complex"}</span>
            </div>
            <p>
              <strong>Flat / Unit:</strong> {successData.resident?.block ? `Block ${successData.resident.block}, ` : ""}Flat #{successData.resident?.flatNumber || successData.user?.flatNumber}
            </p>
            <p>
              <strong>Resident Status:</strong> {successData.resident?.residentType || "Resident"} ({successData.resident?.status || "Active"})
            </p>
            <p>
              <strong>Registered Mobile:</strong> {successData.resident?.phone}
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/dashboard/support";
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
          >
            Go to Society Complaints & Dashboard <ArrowRight size={18} />
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 sm:p-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur border border-white/20 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-sm mb-4">
            <Building2 size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Activate Resident Account
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Set your secret password using the activation code sent by your apartment association or committee admin.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Activation Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Registered Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              6-Digit Activation Code *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 582914"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest text-lg font-bold text-center transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Check WhatsApp or SMS from your society administrator for your 6-digit code.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Create Your Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pr-11 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Confirm Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Activating Account..."
              ) : (
                <>
                  <KeyRound size={18} /> Activate & Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Already activated?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-bold">
            Sign in to existing account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function ResidentActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          Loading activation portal...
        </div>
      }
    >
      <ResidentActivateContent />
    </Suspense>
  );
}
