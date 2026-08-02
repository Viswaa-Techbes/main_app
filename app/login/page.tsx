import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata = {
  title: "Sign In | TechBes IT Marketplace",
  description: "Log in to your Techbes account to manage bookings, track technicians, and access IT service history.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect || "/dashboard";

  if (params.mode === "signup") {
    return <SignupForm redirectTo={redirectTo} />;
  }

  return <LoginForm redirectTo={redirectTo} />;
}
