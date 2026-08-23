"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Lock, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/features/auth/services/auth-service";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!token || !email) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Invalid Link</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            This password reset link is invalid or incomplete. Please request a new link from the login page.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsSubmitting(true);
    try {
      const res = await authService.resetPassword({ token, email, password });
      if (res.success) {
        setSuccess(res.message || "Your password has been successfully reset.");
      } else {
        setError(res.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md">T</div>
          <h2 className="mt-4 text-xl font-extrabold text-slate-900">Set New Password</h2>
          <p className="mt-1.5 text-xs text-slate-400 font-semibold">Please enter your new password for {email}</p>
        </div>

        {error && (
          <div className="flex gap-2 items-center bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3 rounded-xl">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="flex gap-2 items-center bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold p-3 rounded-xl">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">You can now sign in using your new password.</p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <Label htmlFor="pass" className="text-xs font-bold text-slate-700">New Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                <Input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 pr-10"
                  required
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

            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass" className="text-xs font-bold text-slate-700">Confirm Password</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                <Input
                  id="confirm-pass"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your password"
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 pr-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : "Reset Password"}
            </Button>

          </form>
        )}

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
