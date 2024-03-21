// utils/ApiError.js

class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(msg) {
        return new ApiError(400, msg);
    }

    // ... other static methods for different errors
}

module.exports = ApiError;
