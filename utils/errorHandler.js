// utils/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err); // Or use a dedicated logger
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
};

module.exports = errorHandler;