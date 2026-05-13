"use client";

import { useState, useEffect } from "react";
import { InputOTP } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authService } from "@/features/auth/services/auth-service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export default function OtpPage() {
  const [destination, setDestination] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  async function handleSend() {
    setSendError(null);
    setIsSending(true);
    setDemoCode(null);

    try {
      const res = await authService.sendOtp(destination);
      if ((res as any)?.demoCode) setDemoCode((res as any).demoCode);
      setSecondsLeft(30);
    } catch (err: any) {
      setSendError(err?.message || "Unable to send OTP");
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerify() {
    setVerifyError(null);
    setIsVerifying(true);

    try {
      await authService.verifyOtp(destination, otp, true);
      // refresh page to pick up session
      window.location.href = "/dashboard";
    } catch (err: any) {
      setVerifyError(err?.message || "OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-4 text-2xl font-semibold">OTP Sign-in / Sign-up</h2>

      <div className="mb-4">
        <Label htmlFor="destination">Mobile or email</Label>
        <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="9876543210 or name@example.com" />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSend} disabled={!destination || isSending || secondsLeft > 0}>
          {isSending ? (
            <>
              <Spinner className="h-4 w-4" /> Sending...
            </>
          ) : secondsLeft > 0 ? (
            `Resend in ${secondsLeft}s`
          ) : (
            "Send OTP"
          )}
        </Button>
        <Button variant="ghost" onClick={() => { setDestination(""); setDemoCode(null); setOtp(""); }}>
          Clear
        </Button>
      </div>

      {sendError ? <p className="mt-3 text-sm text-red-600">{sendError}</p> : null}
      {demoCode ? <p className="mt-3 text-sm text-amber-700">Demo code: {demoCode}</p> : null}

      <div className="mt-6">
        <Label htmlFor="otp">Enter OTP</Label>
        <InputOTP value={otp} onChange={(value: string) => setOtp(value)} length={6} />
        {verifyError ? <p className="mt-2 text-sm text-red-600">{verifyError}</p> : null}

        <div className="mt-4 flex gap-3">
          <Button onClick={handleVerify} disabled={otp.length < 6 || isVerifying}>
            {isVerifying ? (
              <>
                <Spinner className="h-4 w-4" /> Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
