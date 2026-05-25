import { apiClient } from "@/core/api/api-client";
import { sanitizeEmail, sanitizeText } from "@/core/utils/sanitize";
import { LoginPayload, LoginResponse, SessionResponse } from "@/features/auth/types/auth";

export const authService = {
  async login(payload: LoginPayload) {
    return apiClient<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: sanitizeEmail(payload.email),
        password: sanitizeText(payload.password),
        rememberMe: payload.rememberMe,
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
};
