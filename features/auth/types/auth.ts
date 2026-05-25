export type UserRole = "admin" | "user";

export type AuthUser = {
  email: string;
  role: UserRole;
};

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};

export type LoginResponse = {
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};
