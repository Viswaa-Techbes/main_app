type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta ? [message, meta] : [message];

  if (level === "error") {
    const isDevClient = typeof window !== "undefined" && process.env.NODE_ENV === "development";
    if (isDevClient) {
      console.warn("[techbes] [ERROR]", ...payload);
    } else {
      console.error("[techbes]", ...payload);
    }
    return;
  }

  if (level === "warn") {
    console.warn("[techbes]", ...payload);
    return;
  }

  console.info("[techbes]", ...payload);
}

export const logger = {
  info(message: string, meta?: unknown) {
    write("info", message, meta);
  },
  warn(message: string, meta?: unknown) {
    write("warn", message, meta);
  },
  error(message: string, meta?: unknown) {
    write("error", message, meta);
  },
};
