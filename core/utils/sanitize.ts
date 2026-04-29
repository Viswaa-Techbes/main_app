export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function sanitizeEmail(value: string) {
  return sanitizeText(value).toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function sanitizeMobileNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 15);
}

export function isValidMobileNumber(value: string) {
  return /^\d{10,15}$/.test(value);
}
