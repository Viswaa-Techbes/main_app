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

  async sendOtp(identifier: string) {
    const isMobile = /^[0-9]{10}$/.test(identifier.trim());
    const body: any = {};
    if (isMobile) {
      body.mobileNumber = sanitizeText(identifier);
    } else {
      body.email = sanitizeEmail(identifier);
    }
    return apiClient<{ success: boolean; message: string; expiresInSeconds?: number }>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async verifyOtp(identifier: string, otp: string) {
    const isMobile = /^[0-9]{10}$/.test(identifier.trim());
    const body: any = { otp: sanitizeText(otp) };
    if (isMobile) {
      body.mobileNumber = sanitizeText(identifier);
    } else {
      body.email = sanitizeEmail(identifier);
    }
    const response = await apiClient<any>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (response && response.token) {
      persistToken(response.token);
    }
    return response;
  },

  async forgotPassword(email: string) {
    return apiClient<{ success: boolean; message: string; token?: string; resetLink?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: sanitizeEmail(email) }),
    });
  },

  async resetPassword(payload: any) {
    return apiClient<{ success: boolean; message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: sanitizeEmail(payload.email),
        token: sanitizeText(payload.token),
        password: sanitizeText(payload.password),
      }),
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
