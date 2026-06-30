"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { UserRound, Phone, Mail, Lock, MapPin, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle, Home, Building, Store, Factory, Warehouse } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";
import { useAuth } from "@/features/auth/context/auth-context";
import { PageStatus } from "@/shared/components/feedback/page-status";
import dynamic from "next/dynamic";

// Lazy-load Leaflet map to avoid SSR issues
const SignupMap = dynamic(() => import("./signup-map").then((m) => m.SignupMap), {
  ssr: false,
  loading: () => (
    <div className="h-48 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-400 font-semibold">
      Loading map...
    </div>
  ),
});

type Step = 1 | 2 | 3;

const ADDRESS_TYPES = [
  { id: "home", label: "Home", icon: Home },
  { id: "office", label: "Office", icon: Building },
  { id: "shop", label: "Shop", icon: Store },
  { id: "factory", label: "Factory", icon: Factory },
  { id: "warehouse", label: "Warehouse", icon: Warehouse },
] as const;

export function SignupForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const { status, register, refreshSession } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Personal Details
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [email, setEmail] = useState("");

  // Step 2 — Address Details
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState<string>("home");
  const [lat, setLat] = useState<number>(12.9625);
  const [lng, setLng] = useState<number>(77.5155);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Step 3 — Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace(redirectTo);
  }, [redirectTo, router, status]);

  // Auto-fetch location from pincode
  useEffect(() => {
    if (pincode.length !== 6) return;
    const timer = setTimeout(async () => {
      setPincodeLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data?.[0]?.Status === "Success") {
          const p = data[0].PostOffice?.[0];
          if (p) {
            setState(p.State || "");
            setDistrict(p.District || "");
            setCity(p.District || "");
          }
        }
        // Also geocode to get lat/lng via Nominatim
        const geo = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`);
        const geoData = await geo.json();
        if (geoData?.[0]) {
          setLat(parseFloat(geoData[0].lat));
          setLng(parseFloat(geoData[0].lon));
          setMapReady(true);
        }
      } catch {
        // Silently ignore geocode errors
      } finally {
        setPincodeLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [pincode]);

  function validateStep1() {
    if (name.trim().length < 2) return "Enter your full name.";
    if (!/^\d{10}$/.test(mobile.trim())) return "Enter a valid 10-digit mobile number.";
    if (altMobile && !/^\d{10}$/.test(altMobile.trim())) return "Alternate mobile must be 10 digits.";
    return "";
  }

  function validateStep2() {
    if (!/^\d{6}$/.test(pincode.trim())) return "Enter a valid 6-digit pincode.";
    if (!state) return "State could not be determined. Check pincode.";
    if (!houseNo.trim()) return "Enter your house/flat number.";
    return "";
  }

  function validateStep3() {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  }

  function goNext() {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) return setError(err);
    }
    setStep((s) => Math.min(s + 1, 3) as Step);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const err = validateStep3();
    if (err) return setError(err);

    setIsSubmitting(true);
    try {
      const fullAddress = [houseNo, street, area, city, district, state, pincode].filter(Boolean).join(", ");
      await register({
        name,
        email,
        password,
        phone: mobile,
        emailVerificationToken: "skipped",
        // Extended fields (picked up by updated register endpoint)
        ...{
          alternateMobile: altMobile,
          address: {
            addressLine1: houseNo ? `${houseNo}${street ? ", " + street : ""}` : street,
            addressLine2: area,
            city,
            district,
            state,
            pincode,
            landmark,
            addressType,
            latitude: lat,
            longitude: lng,
            formattedAddress: fullAddress,
          },
        },
      } as any);
      await refreshSession();
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      logger.warn("Signup failed", err);
      setError(err instanceof AppError ? err.message : "Could not create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") return <PageStatus message="Checking your session..." />;

  return (
    <div className="flex min-h-screen items-stretch">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_55%)] pointer-events-none" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg">T</div>
          <span className="font-extrabold text-base tracking-tight">Techbes</span>
        </div>
        <div className="relative z-10 space-y-5 max-w-sm">
          <h1 className="text-3xl font-extrabold tracking-tight leading-snug">Create Your Techbes Account</h1>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Access verified IT service booking, live technician tracking, digital invoices, and warranty management from one dashboard.
          </p>
          {/* Step indicators */}
          <div className="flex items-center gap-3">
            {([1, 2, 3] as Step[]).map((s) => (
              <div key={s} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${step >= s ? "text-white" : "text-slate-600"}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${step > s ? "bg-blue-600 border-blue-600 text-white" : step === s ? "border-blue-400 text-blue-400" : "border-slate-700 text-slate-600"}`}>
                  {step > s ? "✓" : s}
                </div>
                {s === 1 ? "Personal" : s === 2 ? "Address" : "Password"}
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-[10px] text-slate-600 font-bold uppercase tracking-wider">© 2026 Techbes India</p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Step header */}
          <div>
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              {([1, 2, 3] as Step[]).map((s) => (
                <div key={s} className={`h-1.5 rounded-full flex-1 transition-colors ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Step {step} of 3</span>
            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              {step === 1 ? "Personal Details" : step === 2 ? "Service Address" : "Set Password"}
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-semibold">
              {step === 1 ? "We need your basic info to create your account." : step === 2 ? "We'll show available services in your area." : "Choose a secure password for your account."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex gap-2 items-center bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold p-3 rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Step 1 — Personal Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <SF icon={UserRound} id="name" label="Full Name" value={name} onChange={setName} autoComplete="name" placeholder="Your full name" />
              <SF icon={Phone} id="mobile" label="Mobile Number" type="tel" value={mobile} onChange={setMobile} autoComplete="tel" placeholder="10-digit mobile number" />
              <SF icon={Phone} id="altMobile" label="Alternate Mobile (Optional)" type="tel" value={altMobile} onChange={setAltMobile} autoComplete="tel" placeholder="Optional" />
              <SF icon={Mail} id="email" label="Email Address (Optional)" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="email@example.com" />
              <Button type="button" onClick={goNext} className="h-10 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ── Step 2 — Address ── */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Pincode */}
              <div className="space-y-1.5">
                <Label htmlFor="pincode" className="text-xs font-bold text-slate-700">Pincode <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                  <Input id="pincode" type="text" inputMode="numeric" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9" placeholder="6-digit pincode" />
                  {pincodeLoading && <Spinner className="absolute right-3 top-3 h-4 w-4 text-blue-500" />}
                </div>
                {state && <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {city}, {district}, {state}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SF icon={MapPin} id="state" label="State" value={state} onChange={setState} placeholder="Auto-filled" />
                <SF icon={MapPin} id="district" label="District" value={district} onChange={setDistrict} placeholder="Auto-filled" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SF icon={MapPin} id="city" label="City" value={city} onChange={setCity} />
                <SF icon={MapPin} id="area" label="Area / Locality" value={area} onChange={setArea} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SF icon={Home} id="houseNo" label="House / Flat No. *" value={houseNo} onChange={setHouseNo} />
                <SF icon={MapPin} id="street" label="Street" value={street} onChange={setStreet} />
              </div>
              <SF icon={MapPin} id="landmark" label="Landmark (Optional)" value={landmark} onChange={setLandmark} placeholder="Near school, temple, etc." />

              {/* Address Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Address Type</Label>
                <div className="flex flex-wrap gap-2">
                  {ADDRESS_TYPES.map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" onClick={() => setAddressType(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${addressType === id ? "bg-blue-600 border-blue-600 text-white shadow-sm" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"}`}>
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaflet Map */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Pin Your Location</Label>
                <p className="text-[10px] text-slate-400 font-semibold">Drag the marker to your exact location.</p>
                <SignupMap lat={lat} lng={lng} onChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
                <p className="text-[10px] text-slate-400 font-semibold text-right">📍 {lat.toFixed(5)}, {lng.toFixed(5)}</p>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setStep(1); setError(""); }} className="h-10 flex-1 rounded-xl border-slate-200 text-xs font-bold">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button type="button" onClick={goNext} className="h-10 flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3 — Password ── */}
          {step === 3 && (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="pass" className="text-xs font-bold text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                  <Input id="pass" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 pr-10" placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cpass" className="text-xs font-bold text-slate-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
                  <Input id="cpass" type={showPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 pr-10" placeholder="Re-enter password" />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1 text-[10px] font-semibold text-slate-500">
                <p className="font-bold text-slate-700 text-xs mb-2">Account Summary</p>
                <p>👤 {name} · 📱 {mobile}</p>
                {email && <p>✉️ {email}</p>}
                <p>📍 {houseNo && `${houseNo}, `}{area && `${area}, `}{city && `${city}`}{state && `, ${state}`} — {pincode}</p>
                <p>🏷️ {addressType.charAt(0).toUpperCase() + addressType.slice(1)}</p>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setStep(2); setError(""); }} className="h-10 flex-1 rounded-xl border-slate-200 text-xs font-bold">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-10 flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5">
                  {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// Simple FormField helper
function SF({
  icon: Icon, id, label, value, onChange, type = "text", autoComplete, placeholder, disabled,
}: {
  icon: typeof Home; id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; autoComplete?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold text-slate-700">{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-3 text-slate-400 h-4 w-4" />
        <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} disabled={disabled} className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs pl-9 disabled:opacity-60" />
      </div>
    </div>
  );
}
