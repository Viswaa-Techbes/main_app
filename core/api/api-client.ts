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
    const errorPayload = payload || {};
    const message =
      parseAs === "text"
        ? "Request failed."
        : typeof errorPayload.message === "string"
          ? errorPayload.message
          : "Something went wrong.";

    logger.error(`API request failed: ${response.status} ${message}`, {
      url,
      status: response.status,
      payload: errorPayload,
    });

    const error = new AppError(message, {
      status: response.status,
      details: errorPayload,
    });

    throw error;
  }

  return payload as T;
}

// Add helper methods
apiClient.get = async function<T>(url: string, options?: RequestOptions): Promise<{ data: T }> {
  const data = await apiClient<T>(url, { ...options, method: "GET" });
  return { data };
};

apiClient.post = async function<T>(url: string, body?: any, options?: RequestOptions): Promise<{ data: T }> {
  const data = await apiClient<T>(url, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  return { data };
};

apiClient.patch = async function<T>(url: string, body?: any, options?: RequestOptions): Promise<{ data: T }> {
  const data = await apiClient<T>(url, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
  return { data };
};
apiClient.put = async function<T>(url: string, body?: any, options?: RequestOptions): Promise<{ data: T }> {
  const data = await apiClient<T>(url, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
  return { data };
};

apiClient.delete = async function<T>(url: string, options?: RequestOptions): Promise<{ data: T }> {
  const data = await apiClient<T>(url, { ...options, method: "DELETE" });
  return { data };
};
