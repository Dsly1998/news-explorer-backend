const requestLogger = (req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
    };

    // Append to request log
    fs.appendFile(path.join(__dirname, '../logs/request.log'), JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to request log:', err);
        }
    });

    // Error logging
    const originalSend = res.send;
    res.send = function(data) {
        if (res.statusCode >= 400) { // Log only when there's an error
            const errorLogEntry = {
                ...logEntry,
                statusCode: res.statusCode,
                error: data
            };
            fs.appendFile(path.join(__dirname, '../logs/error.log'), JSON.stringify(errorLogEntry) + '\n', (err) => {
                if (err) {
                    console.error('Error writing to error log:', err);
                }
            });
        }
        originalSend.apply(res, arguments);
    };

    next();
};

module.exports = requestLogger;
