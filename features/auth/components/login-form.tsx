"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";
import { isValidEmail, sanitizeEmail } from "@/core/utils/sanitize";
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
  email?: string;
  password?: string;
  form?: string;
};

function validateLoginForm(email: string, password: string) {
  const errors: FormErrors = {};

  if (!isValidEmail(sanitizeEmail(email))) {
    errors.email = "Enter a valid email address.";
  }

  if (password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const { status, login, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
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

    const nextErrors = validateLoginForm(email, password);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({
        email,
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-white/80 bg-white py-0 shadow-lg">
          <CardHeader className="gap-3 border-b border-slate-100 px-6 py-6 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl text-slate-950">Welcome back</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">Sign in to manage your bookings</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {errors.form ? <InlineAlert message={errors.form} /> : null}

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@company.com"
                    className={`h-12 rounded-lg pl-10 ${errors.email ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'}`}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                  />
                </div>
                {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className={`h-12 rounded-lg ${errors.password ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'}`}
                  aria-invalid={Boolean(errors.password)}
                  autoComplete="current-password"
                />
                {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="remember-me" className="cursor-pointer text-sm font-medium text-slate-600">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <span className="ml-2">Remember me</span>
                </Label>

                <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="h-12 w-full rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span className="ml-2">Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-center text-sm text-slate-500">Use your registered email and password to sign in.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
