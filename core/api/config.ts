const getFallbackUrl = () => {
  return "https://api.techbes.co.in";
};

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    // On the client side (browser), always make requests relative to the frontend origin to prevent CORS errors.
    // Next.js rewrites in next.config.mjs will proxy these requests to the backend server.
    return "";
  }
  // On the server side, use the absolute backend API URL.
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.techbes.co.in"
  );
}

export const API_BASE_URL = typeof window !== "undefined" ? "" : (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.techbes.co.in"
);

export function getBackendApiUrl(path: string) {
  const base = (process.env.BACKEND_API_URL || getApiBaseUrl() || "https://api.techbes.co.in").replace(/\/$/, "");
  const nextPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${nextPath}`;
}

export const AUTH_TOKEN_STORAGE_KEY = "techbes_backend_token";
