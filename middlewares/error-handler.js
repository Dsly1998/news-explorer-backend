const logger = require("./logger"); // Adjust the path as necessary
const { isCelebrateError } = require("celebrate");

const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error(`Error: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack,
    error: err,
  });

  // Check if the error is a known type and handle it
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError ||
    err instanceof ServerError
  ) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle validation errors (e.g., from Joi/Celebrate)
  if (isCelebrateError(err)) {
    const details =
      err.details.get("body") ||
      err.details.get("query") ||
      err.details.get("params");
    return res.status(400).json({
      message: "Validation failed",
      details,
    });
  }

  // For unhandled errors, respond with 500 Internal Server Error
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
