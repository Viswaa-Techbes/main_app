import crypto from "crypto";

const encoder = new TextEncoder();

function toBase64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export type AuthTokenPayload = {
  sub: string;
  name?: string;
  mobileNumber: string;
  email?: string;
  role: "admin" | "user";
  exp: number;
  backendToken?: string;
};

function getSecret() {
  return process.env.AUTH_SECRET || "techbes-dev-secret-change-me";
}

export function signToken(payload: AuthTokenPayload) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", encoder.encode(getSecret())).update(unsignedToken).digest("base64url");

  return `${unsignedToken}.${signature}`;
}

export function verifyToken(token: string) {
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", encoder.encode(getSecret()))
    .update(unsignedToken)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload)) as AuthTokenPayload;

  if (payload.exp * 1000 <= Date.now()) {
    return null;
  }

  return payload;
}
