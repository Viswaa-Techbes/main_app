import { apiClient } from "@/core/api/api-client";
import { sanitizeEmail, sanitizeMobileNumber, sanitizeText } from "@/core/utils/sanitize";
import { LoginPayload, LoginResponse, RegisterPayload, SessionResponse } from "@/features/auth/types/auth";

export const authService = {
  async login(payload: LoginPayload) {
    return apiClient<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        mobileNumber: sanitizeMobileNumber(payload.mobileNumber),
        password: sanitizeText(payload.password),
        rememberMe: payload.rememberMe,
      }),
    });
  },

  async register(payload: RegisterPayload) {
    return apiClient<LoginResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: sanitizeText(payload.name),
        mobileNumber: sanitizeMobileNumber(payload.mobileNumber),
        email: payload.email ? sanitizeEmail(payload.email) : "",
        password: sanitizeText(payload.password),
      }),
    });
  },

  async logout() {
    return apiClient<{ success: true }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  async getSession() {
    return apiClient<SessionResponse>("/api/auth/session", {
      method: "GET",
    });
  },
  async sendOtp(destination: string) {
    return apiClient<{ success: true; demoCode?: string }>("/api/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({ destination }),
    });
  },

  async verifyOtp(destination: string, code: string, createIfMissing = true, name?: string) {
    return apiClient<{ success: true; user?: any }>("/api/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ destination, code, createIfMissing, name }),
    });
  },
};
