const { isCelebrateError } = require("celebrate");
const BadRequestError = require("./errors/BadRequestError");
const UnauthorizedError = require("./errors/UnauthorizedError");
const ForbiddenError = require("./errors/ForbiddenError");
const NotFoundError = require("./errors/NotFoundError");
const ConflictError = require("./errors/ConflictError");
const ServerError = require("./errors/ServerError");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  console.error("Error occurred in route:", req.path);
  console.error("Request method:", req.method);

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
    return res.status(400).json({
      message: "Validation failed",
      details:
        err.details.get("body") ||
        err.details.get("query") ||
        err.details.get("params"),
    });
  }

  // For unhandled errors, log them and respond with 500 Internal Server Error
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
