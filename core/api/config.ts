export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export function getBackendApiUrl(path: string) {
  const base = (process.env.BACKEND_API_URL || API_BASE_URL).replace(/\/$/, "");
  const nextPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${nextPath}`;
}

export const AUTH_TOKEN_STORAGE_KEY = "techbes_backend_token";
