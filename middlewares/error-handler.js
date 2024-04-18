const { isCelebrateError } = require("celebrate");
const logger = require("./logger"); // Import the logger you configured
const BadRequestError = require("./errors/BadRequestError");
const UnauthorizedError = require("./errors/UnauthorizedError");
const ForbiddenError = require("./errors/ForbiddenError");
const NotFoundError = require("./errors/NotFoundError");
const ConflictError = require("./errors/ConflictError");
const ServerError = require("./errors/ServerError");

const errorHandler = (err, req, res, next) => {
  let logMessage = `${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;

  // Check if the error is a known type and handle it
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof ServerError
  ) {
    logger.error(logMessage); // Log known type errors to error.log
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle validation errors (e.g., from Joi/Celebrate)
  if (isCelebrateError(err)) {
    const details =
      err.details.get("body") ||
      err.details.get("query") ||
      err.details.get("params");
    logger.error(
      `Validation Error: ${JSON.stringify(details)} - ${logMessage}`,
    ); // Log validation errors to error.log
    return res.status(400).json({
      message: "Validation failed",
      details,
    });
  }

  // For unhandled errors, log them and respond with 500 Internal Server Error
  logger.error(`Unhandled Error: ${logMessage}`); // Log unhandled errors to error.log
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
