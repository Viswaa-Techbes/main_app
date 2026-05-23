"use client";

import Link from "@/components/ui/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Phone } from "lucide-react";

import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";
import { isValidMobileNumber, sanitizeMobileNumber } from "@/core/utils/sanitize";
import { useAuth } from "@/features/auth/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { InlineAlert } from "@/shared/components/feedback/inline-alert";
import { PageStatus } from "@/shared/components/feedback/page-status";

type FormErrors = {
  mobileNumber?: string;
  password?: string;
  form?: string;
};

function validateLoginForm(mobileNumber: string, password: string) {
  const errors: FormErrors = {};

  if (!isValidMobileNumber(sanitizeMobileNumber(mobileNumber))) {
    errors.mobileNumber = "Enter a valid 10 digit mobile number.";
  }

  if (password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const { status, login, refreshSession } = useAuth();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLoginForm(mobileNumber, password);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({
        mobileNumber,
        password,
        rememberMe,
      });

      await refreshSession();
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      logger.warn("Login request failed", error);
      setErrors({
        form: error instanceof AppError ? error.message : "Unable to log in right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") {
    return <PageStatus message="Checking your session..." />;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-accent-light" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-96" style={{ background: 'radial-gradient(circle at bottom right, rgba(255,122,0,0.08), transparent 50%)' }} />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Secure dashboard access
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Customer access for bookings, service visits, and technician updates.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                Log in with your registered mobile number to view bookings, saved addresses, service history, and
                upcoming technician visits.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60">
                  <p className="text-sm font-semibold text-slate-900">Protected sessions</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Keep track of upcoming appointments, completed services, and payment status in one place.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/60">
                  <p className="text-sm font-semibold text-slate-900">Role-aware access</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    New customers can create an account before booking or while checking out.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border border-border bg-card py-0" style={{boxShadow: 'var(--shadow-elevated)'}}>
            <CardHeader className="gap-3 border-b border-slate-100 px-8 py-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-slate-950">Welcome back</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Use your registered mobile number and password to open your customer dashboard.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-8 py-8">
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {errors.form ? <InlineAlert message={errors.form} /> : null}

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile number</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="mobileNumber"
                      type="tel"
                      inputMode="numeric"
                      value={mobileNumber}
                      onChange={(event) => setMobileNumber(sanitizeMobileNumber(event.target.value))}
                      placeholder="9876543210"
                      className="h-12 rounded-lg border-border-primary bg-bg-secondary pl-11"
                      aria-invalid={Boolean(errors.mobileNumber)}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.mobileNumber ? <p className="text-sm text-red-600">{errors.mobileNumber}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-12 rounded-lg border-border-primary bg-bg-secondary"
                    aria-invalid={Boolean(errors.password)}
                    autoComplete="current-password"
                  />
                  {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="remember-me" className="cursor-pointer text-sm font-medium text-slate-600">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    Remember me
                  </Label>

                  <Link href="#" className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
                    <span>Forgot password?</span>
                  </Link>
                </div>

                <Button type="submit" size="lg" className="h-12 w-full rounded-2xl" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  New to Techbes?{" "}
                  <Link href="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">
                    <span>Create a customer account</span>
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
