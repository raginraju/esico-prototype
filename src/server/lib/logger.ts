type LogLevel = "info" | "warn" | "error";

type LogData = Record<string, unknown>;

function write(level: LogLevel, event: string, message: string, data?: LogData) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    message,
    ...data,
  };

  console[level](JSON.stringify(entry));
}

export const auditLogger = {
  info: (event: string, message: string, data?: LogData) =>
    write("info", event, message, data),
  warn: (event: string, message: string, data?: LogData) =>
    write("warn", event, message, data),
  error: (event: string, message: string, data?: LogData) =>
    write("error", event, message, data),
};
