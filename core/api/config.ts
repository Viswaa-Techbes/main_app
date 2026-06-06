const getFallbackUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
      return "http://localhost:5000";
    }
    return "https://technician-app.onrender.com";
  }
  return process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://technician-app.onrender.com";
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  getFallbackUrl();

export function getBackendApiUrl(path: string) {
  const base = (process.env.BACKEND_API_URL || API_BASE_URL).replace(/\/$/, "");
  const nextPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${nextPath}`;
}

export const AUTH_TOKEN_STORAGE_KEY = "techbes_backend_token";
