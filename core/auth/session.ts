import { cookies } from "next/headers";

import { verifyToken } from "@/core/auth/jwt";

export const AUTH_COOKIE_KEY = "techbes_session";

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_KEY)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
