"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
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
      await login({ email, password, rememberMe: true });
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md border-white/80 bg-white py-0 shadow-lg">
        <CardHeader className="gap-3 border-b border-slate-100 px-6 py-6 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl text-slate-950">{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              {mode === "login" ? "Sign in to continue booking" : "Fill details below to create your account"}
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <Button type="button" variant={mode === "login" ? "default" : "ghost"} className="rounded-md" onClick={() => setMode("login")}>
              Login
            </Button>
            <Button type="button" variant={mode === "signup" ? "default" : "ghost"} className="rounded-md" onClick={() => setMode("signup")}>
              Signup
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-6">
          {error ? <InlineAlert message={error} /> : null}
          {message ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div> : null}

          {mode === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin} noValidate>
              <AuthInput icon={Mail} id="login-email" label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
              <AuthInput id="login-password" label="Password" value={password} onChange={setPassword} type="password" autoComplete="current-password" />
              <SubmitButton loading={isSubmitting} label="Login" loadingLabel="Logging in..." />
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleDirectSignup} noValidate>
              <AuthInput icon={UserRound} id="signup-name" label="Full name" value={name} onChange={setName} autoComplete="name" />
              <AuthInput icon={Mail} id="signup-email" label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
              <AuthInput icon={Phone} id="signup-phone" label="Phone" value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
              <AuthInput id="signup-password" label="Password" value={password} onChange={setPassword} type="password" autoComplete="new-password" />
              <SubmitButton loading={isSubmitting} label="Signup" loadingLabel="Signing up..." />
            </form>
          )}
        </CardContent>
      </Card>
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
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" /> : null}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 rounded-lg border-slate-200 ${Icon ? "pl-10" : ""}`}
          autoComplete={autoComplete}
        />
      </div>
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <Button type="submit" size="lg" className="h-12 w-full rounded-lg" disabled={loading}>
      {loading ? (
        <>
          <Spinner className="h-4 w-4" />
          <span className="ml-2">{loadingLabel}</span>
        </>
      ) : (
        label
      )}
    </Button>
  );
}
