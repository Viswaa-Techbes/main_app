import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Log In | Techbes Marketplace",
  description: "Access your Techbes dashboard to manage services, bookings, and support updates.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return <LoginForm redirectTo={params.redirect || "/dashboard"} />;
}
