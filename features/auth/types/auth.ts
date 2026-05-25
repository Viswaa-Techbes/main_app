export type UserRole = "admin" | "manager" | "technician" | "client" | "user";

export type AuthUser = {
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  role: UserRole;
  token?: string;
};

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  emailVerificationToken: string;
};
