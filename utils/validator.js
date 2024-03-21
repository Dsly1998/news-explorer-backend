// utils/validator.js

const { body, validationResult } = require('express-validator');

// Example validation for a user creation route
const createUserValidator = [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').not().isEmpty().withMessage('Name is required'),
    // More validations can be added as per requirement
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    createUserValidator,
    // You can export other validators as needed
};
