const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, errors } = format;

// Define a custom format for better readability.
const logFormat = printf(({ level, message, timestamp, stack }) => {
  // Include the stack trace if available
  return `${timestamp} ${level}: ${message}${stack ? ` | Stack: ${stack}` : ""}`;
});

// Initialize logger
const logger = createLogger({
  level: "info", // Logs everything from 'info' level and above.
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Custom timestamp format
    errors({ stack: true }), // Capture stack trace for error objects
    logFormat,
  ),
  transports: [
    // Transport for error logs
    new transports.File({ filename: "error.log", level: "error" }),
    // Transport for informational logs
    new transports.File({ filename: "request.log", level: "info" }),
  ],
});

// In non-production environments, also log to the console.
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        format.colorize(), // Colorize log output for better readability on the console
        logFormat,
      ),
    }),
  );
}

module.exports = logger;
