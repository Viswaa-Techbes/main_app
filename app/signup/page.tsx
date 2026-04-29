import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = {
  title: "Sign Up | Techbes Marketplace",
  description: "Create a Techbes customer account to book services and track technician visits.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return <RegisterForm redirectTo={params.redirect || "/dashboard"} />;
}
