const winston = require("winston");

const { format, transports } = winston;

// Custom format for logging
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Logger configuration
const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.json(), logFormat),
  transports: [
    new transports.File({ filename: "request.log", level: "info" }),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
}

module.exports = logger;
