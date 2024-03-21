// config/config.js

require('dotenv').config();

module.exports = {
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    // other config variables
};
