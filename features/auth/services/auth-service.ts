import { apiClient } from "@/core/api/api-client";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { sanitizeEmail, sanitizeText } from "@/core/utils/sanitize";
import { LoginPayload, LoginResponse, SessionResponse, SignupPayload } from "@/features/auth/types/auth";

function persistToken(token?: string) {
  if (typeof window !== "undefined" && token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }
}

export const authService = {
  async login(payload: LoginPayload) {
    const response = await apiClient<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: sanitizeEmail(payload.email),
        password: sanitizeText(payload.password),
        rememberMe: payload.rememberMe,
      }),
    });
    persistToken(response.token);
    return response;
  },

  async sendOtp(email: string) {
    return apiClient<{ success: boolean; message: string; expiresInSeconds?: number }>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email: sanitizeEmail(email) }),
    });
  },

  async verifyOtp(email: string, otp: string) {
    return apiClient<{ success: boolean; message: string; data: { emailVerificationToken: string } }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email: sanitizeEmail(email), otp: sanitizeText(otp) }),
    });
  },

  async register(payload: SignupPayload) {
    const response = await apiClient<LoginResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: sanitizeText(payload.name),
        email: sanitizeEmail(payload.email),
        password: sanitizeText(payload.password),
        phone: sanitizeText(payload.phone),
        mobileNumber: sanitizeText(payload.phone),
        emailVerificationToken: payload.emailVerificationToken,
      }),
    });
    persistToken(response.token);
    return response;
  },

  async logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
    return apiClient<{ success: true }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  async getSession() {
    const session = await apiClient<SessionResponse>("/api/auth/session", {
      method: "GET",
    });
    persistToken(session.user?.token);
    return session;
  },
};
