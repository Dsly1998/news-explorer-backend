const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../Utils/config");
const UnauthorizedError = require("./errors/UnauthorizedError");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided, authorization denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new UnauthorizedError("Token expired, please log in again");
    }
    throw new UnauthorizedError("Token is not valid");
  }
};

module.exports = auth;
