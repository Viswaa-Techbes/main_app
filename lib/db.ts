import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readJson<T = any>(name: string, fallback: T): T {
  ensureDataDir();
  const file = path.join(DATA_DIR, name);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }

  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    return fallback;
  }
}

export function writeJson<T = any>(name: string, value: T) {
  ensureDataDir();
  const file = path.join(DATA_DIR, name);
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

export type UserRecord = {
  id: string;
  name?: string;
  mobileNumber?: string;
  email?: string;
  passwordHash?: string;
  otpVerified?: boolean;
  role?: "client" | "admin";
};

export type OtpRecord = {
  id: string;
  destination: string; // mobile or email
  code: string;
  expiresAt: number;
  used?: boolean;
};

export type BookingRecord = {
  id: string;
  userId: string;
  serviceSlug: string;
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
  technicianId?: string;
  paymentStatus?: "Pending" | "Paid" | "Refunded";
  scheduledAt?: string;
  createdAt: string;
};

export function getUsers(): UserRecord[] {
  return readJson<UserRecord[]>("users.json", []);
}

export function saveUsers(users: UserRecord[]) {
  writeJson("users.json", users);
}

export function getOtps(): OtpRecord[] {
  return readJson<OtpRecord[]>("otps.json", []);
}

export function saveOtps(otps: OtpRecord[]) {
  writeJson("otps.json", otps);
}

export function getBookings(): BookingRecord[] {
  return readJson<BookingRecord[]>("bookings.json", []);
}

export function saveBookings(bookings: BookingRecord[]) {
  writeJson("bookings.json", bookings);
}
