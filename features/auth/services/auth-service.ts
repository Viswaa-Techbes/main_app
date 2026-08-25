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

  async sendOtp(identifier: string, isMobileOverride?: boolean, purpose: string = "login") {
    const clean = identifier.trim();
    const digits = clean.replace(/\D/g, "");
    const isMobile = isMobileOverride !== undefined 
      ? isMobileOverride 
      : (digits.length === 10 || (digits.length === 12 && digits.startsWith("91")));
    
    const body: any = { purpose };
    if (isMobile) {
      body.mobileNumber = digits.length === 12 ? digits.slice(2) : digits;
    } else {
      body.email = clean.toLowerCase();
    }
    return apiClient<{ success: boolean; message: string; expiresInSeconds?: number; otp?: string }>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async verifyOtp(identifier: string, otp: string, isMobileOverride?: boolean, purpose: string = "login") {
    const clean = identifier.trim();
    const digits = clean.replace(/\D/g, "");
    const isMobile = isMobileOverride !== undefined 
      ? isMobileOverride 
      : (digits.length === 10 || (digits.length === 12 && digits.startsWith("91")));

    const body: any = { otp: sanitizeText(otp), purpose };
    if (isMobile) {
      body.mobileNumber = digits.length === 12 ? digits.slice(2) : digits;
    } else {
      body.email = clean.toLowerCase();
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
