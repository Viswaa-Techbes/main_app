"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, Phone, Eye, EyeOff, ShieldAlert, ArrowRight, MessageSquare, Lock, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";
import { isValidEmail, sanitizeEmail } from "@/core/utils/sanitize";
import { useAuth } from "@/features/auth/context/auth-context";
import { PageStatus } from "@/shared/components/feedback/page-status";

type LoginTab = "email" | "mobile";

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const { status, login, sendOtp, verifyOtp, refreshSession } = useAuth();
  const [tab, setTab] = useState<LoginTab>("email");

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Mobile OTP state
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (status === "authenticated") router.replace(redirectTo);
  }, [redirectTo, router, status]);

  // OTP countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  // ── Email Login ──────────────────────────────────────────────────────────────
  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidEmail(sanitizeEmail(email))) return setError("Enter a valid email address.");
    if (password.trim().length < 6) return setError("Password must be at least 6 characters.");
    setIsSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      await refreshSession();
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      logger.warn("Login failed", err);
      setError(err instanceof AppError ? err.message : "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Mobile OTP ───────────────────────────────────────────────────────────────
  async function handleSendOtp() {
    setError("");
    if (!/^\d{10}$/.test(mobile.trim())) return setError("Enter a valid 10-digit mobile number.");
    setIsSubmitting(true);
    try {
      // sendOtp currently takes email; backend also supports mobile via this flow
      await sendOtp(mobile.trim());
      setOtpSent(true);
      setOtpTimer(60);
      setInfo("OTP sent to your mobile number.");
    } catch (err) {
      logger.warn("OTP send failed", err);
      setError(err instanceof AppError ? err.message : "Failed to send OTP. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (otp.trim().length !== 6) return setError("Enter the 6-digit OTP.");
    setIsSubmitting(true);
    try {
      const res = await verifyOtp(mobile.trim(), otp.trim());
      if (res.success) {
        await refreshSession();
        router.replace(redirectTo);
        router.refresh();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      logger.warn("OTP verify failed", err);
      setError(err instanceof AppError ? err.message : "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") return <PageStatus message="Checking your session..." />;

  return (
    <div className="flex min-h-screen items-stretch">
      
      {/* ── Left Column: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_45%)] pointer-events-none" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg">T</div>
          <span className="font-extrabold text-base tracking-tight">Techbes</span>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-6 max-w-sm">
          <h1 className="text-3xl font-extrabold tracking-tight leading-snug">
            India's Trusted<br />IT Service Marketplace
          </h1>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Book CCTV installation, networking, server management, AMC audits, and more — all with certified, background-verified technicians.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["Verified Techs", "Transparent Pricing", "Live Tracking", "30-Day Warranty"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-[10px] text-slate-300 font-bold">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
          © 2026 Techbes India — Secure Login
        </p>
      </div>

      {/* ── Right Column: Form Panel ── */}
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-12 bg-white">
        <div className="w-full max-w-sm space-y-6">

          {/* Heading */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">Welcome back</h2>
            <p className="mt-1.5 text-xs text-slate-400 font-semibold">Sign in to manage your IT service bookings.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
            <TabButton active={tab === "email"} onClick={() => { setTab("email"); setError(""); setInfo(""); }}>
              <Mail className="h-3.5 w-3.5" /> Email Login
            </TabButton>
            <TabButton active={tab === "mobile"} onClick={() => { setTab("mobile"); setError(""); setInfo(""); }}>
              <Phone className="h-3.5 w-3.5" /> Mobile OTP
            </TabButton>
          </div>

          {/* Error / Info Banner */}
          {error && (
            <div className="flex gap-2 items-center bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3 rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {info && (
            <div className="flex gap-2 items-center bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold p-3 rounded-xl">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span>{info}</span>
            </div>
          )}

          {/* ── Email Login Form ── */}
          {tab === "email" && (
            <form className="space-y-4" onSubmit={handleEmailLogin} noValidate>
              <FormField icon={Mail} id="email" label="Email Address" type="email" value={email} onChange={setEmail} autoComplete="email" />
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                  <button type="button" className="text-[10px] text-blue-600 hover:underline font-bold">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-slate-300 h-3.5 w-3.5 text-blue-600" />
                Remember me for 30 days
              </label>

              <SubmitBtn loading={isSubmitting} label="Sign In" />
            </form>
          )}

          {/* ── Mobile OTP Form ── */}
          {tab === "mobile" && (
            <div className="space-y-4">
              <FormField icon={Phone} id="mobile" label="Mobile Number" type="tel" value={mobile} onChange={setMobile} autoComplete="tel" placeholder="10-digit mobile number" disabled={otpSent} />

              {!otpSent ? (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : <><MessageSquare className="h-4 w-4" /> Send OTP</>}
                </Button>
              ) : (
                <form className="space-y-4" onSubmit={handleVerifyOtp} noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="otp" className="text-xs font-bold text-slate-700">Enter 6-digit OTP</Label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 tracking-widest font-mono"
                        placeholder="_ _ _ _ _ _"
                        autoComplete="one-time-code"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                      <span>OTP sent to +91 {mobile}</span>
                      {otpTimer > 0 ? (
                        <span>Resend in {otpTimer}s</span>
                      ) : (
                        <button type="button" onClick={handleSendOtp} className="text-blue-600 hover:underline font-bold">Resend OTP</button>
                      )}
                    </div>
                  </div>
                  <SubmitBtn loading={isSubmitting} label="Verify & Sign In" />
                </form>
              )}
            </div>
          )}

          {/* Sign up link */}
          <p className="text-center text-xs font-semibold text-slate-400">
            Don't have an account?{" "}
            <Link href="/login?mode=signup" className="text-blue-600 hover:underline font-bold ml-1">Create Account</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
        active ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function FormField({
  icon: Icon, id, label, type = "text", value, onChange, autoComplete, placeholder, disabled,
}: {
  icon: typeof Mail;
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold text-slate-700">{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 disabled:opacity-60"
        />
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="h-10 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
    >
      {loading ? <Spinner className="h-4 w-4 text-white" /> : <>{label}<ArrowRight className="h-4 w-4" /></>}
    </Button>
  );
}
