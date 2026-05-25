import { AppError } from "@/core/errors/app-error";
import { logger } from "@/core/logging/logger";

type RequestOptions = RequestInit & {
  parseAs?: "json" | "text";
};

export async function apiClient<T>(input: RequestInfo | URL, init?: RequestOptions): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const parseAs = init?.parseAs ?? "json";
  const payload = parseAs === "text" ? await response.text() : await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      parseAs === "text"
        ? "Request failed."
        : typeof payload?.message === "string"
          ? payload.message
          : "Something went wrong.";

    const error = new AppError(message, {
      status: response.status,
      details: payload,
    });

    if (response.status >= 500) {
      logger.error("API request failed", {
        input: typeof input === "string" ? input : input.toString(),
        status: response.status,
        payload,
      });
    } else {
      logger.warn("API request failed", {
        input: typeof input === "string" ? input : input.toString(),
        status: response.status,
        payload,
      });
    }

    throw error;
  }

  return payload as T;
}
