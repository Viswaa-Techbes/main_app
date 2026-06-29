"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Mail, Phone, UserRound, Eye, EyeOff, ShieldAlert, ArrowRight, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";
import { isValidEmail, sanitizeEmail } from "@/core/utils/sanitize";
import { useAuth } from "@/features/auth/context/auth-context";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";

type Mode = "login" | "signup";

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const { status, login, register, refreshSession } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (status === "authenticated") router.replace(redirectTo);
  }, [redirectTo, router, status]);

  function validateDetails() {
    if (!isValidEmail(sanitizeEmail(email))) return "Enter a valid email address.";
    if (password.trim().length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup" && name.trim().length < 2) return "Enter your full name.";
    if (mode === "signup" && !/^\d{10,15}$/.test(phone.trim())) return "Enter a valid phone number.";
    return "";
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateDetails();
    if (validation) return setError(validation);

    setIsSubmitting(true);
    setError("");
    try {
      await login({ email, password, rememberMe });
      await refreshSession();
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      logger.warn("Login request failed", err);
      setError(err instanceof AppError ? err.message : "Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDirectSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateDetails();
    if (validation) return setError(validation);

    setIsSubmitting(true);
    setError("");
    setMessage("");
    try {
      await register({ name, email, password, phone, emailVerificationToken: "skipped" });
      await refreshSession();
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      logger.warn("Signup request failed", err);
      setError(err instanceof AppError ? err.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") {
    return <PageStatus message="Checking your session..." />;
  }

  return (
    <div className="flex min-h-screen items-stretch bg-slate-50">
      
      {/* Left Column: Visual Brand Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_50%)] pointer-events-none" />
        
        {/* Brand/Logo header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">T</div>
          <span className="font-extrabold text-base tracking-tight">Techbes</span>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            The Premium IT Services Marketplace
          </h1>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Outsource network installations, CCTV configurations, server management, and AMC audits to certified on-demand experts.
          </p>
        </div>

        {/* Legal links */}
        <div className="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          © 2026 Techbes India Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Authentication Card Form */}
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-12 bg-white">
        <div className="w-full max-w-sm space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight sm:text-2xl">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              {mode === "login" ? "Sign in to manage your active IT bookings." : "Configure parameters and register to book services."}
            </p>
          </div>

          {/* Social Logins - UI Only */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <button type="button" className="h-10 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 transition">
              Google
            </button>
            <button type="button" className="h-10 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5 transition">
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-300 my-4 text-xs font-semibold">
            <hr className="flex-1 border-slate-100" />
            <span>or email credentials</span>
            <hr className="flex-1 border-slate-100" />
          </div>

          {/* Form alert */}
          {error && (
            <div className="flex gap-2 items-center bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3.5 rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="flex gap-2 items-center bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold p-3.5 rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Login/Signup forms */}
          {mode === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin} noValidate>
              <AuthInput icon={Mail} id="login-email" label="Email Address" value={email} onChange={setEmail} type="email" autoComplete="email" />
              
              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-center">
                  <Label htmlFor="login-password" className="text-xs font-bold text-slate-700">Password</Label>
                  <button type="button" className="text-[10px] text-blue-600 hover:underline font-bold">Forgot password?</button>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-350 focus:ring-blue-500/25 h-3.5 w-3.5"
                />
                <label htmlFor="remember-me">Remember my credentials</label>
              </div>

              <SubmitButton loading={isSubmitting} label="Login" loadingLabel="Logging in..." />
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleDirectSignup} noValidate>
              <AuthInput icon={UserRound} id="signup-name" label="Full name" value={name} onChange={setName} autoComplete="name" />
              <AuthInput icon={Mail} id="signup-email" label="Email address" value={email} onChange={setEmail} type="email" autoComplete="email" />
              <AuthInput icon={Phone} id="signup-phone" label="Mobile number" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
              
              <div className="space-y-1.5 relative">
                <Label htmlFor="signup-password" className="text-xs font-bold text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <SubmitButton loading={isSubmitting} label="Create Account" loadingLabel="Registering..." />
            </form>
          )}

          {/* Toggle Button */}
          <div className="text-center text-xs font-semibold text-slate-400">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              type="button" 
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setMessage("");
              }}
              className="text-blue-600 hover:underline font-bold ml-1"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function AuthInput({
  icon: Icon,
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  icon?: typeof Mail;
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold text-slate-700">{label}</Label>
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" /> : null}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-10 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20 ${Icon ? "pl-9" : "px-3"}`}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <Button type="submit" className="h-10 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5" disabled={loading}>
      {loading ? (
        <>
          <Spinner className="h-4 w-4 text-white" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
