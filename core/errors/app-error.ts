export class AppError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "AppError";
    this.status = options?.status ?? 500;
    this.code = options?.code;
    this.details = options?.details;
  }
}
