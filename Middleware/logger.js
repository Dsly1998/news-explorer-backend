// middlewares/logger.js

const fs = require('fs');
const path = require('path');

const requestLogger = (req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} - ${req.url}\n`;
    fs.appendFileSync(path.join(__dirname, '../logs/request.log'), logEntry);
    next();
};

module.exports = requestLogger;
