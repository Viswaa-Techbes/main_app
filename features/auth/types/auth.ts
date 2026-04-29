export type UserRole = "admin" | "user";

export type AuthUser = {
  id?: string;
  name?: string;
  mobileNumber: string;
  email?: string;
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
  mobileNumber: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterPayload = {
  name: string;
  mobileNumber: string;
  email?: string;
  password: string;
};
