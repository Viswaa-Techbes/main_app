const DEFAULT_BACKEND_URL = "https://technician-app.onrender.com";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BACKEND_URL;

export function getBackendUrl(path = "") {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
