const { celebrate, Joi, Segments } = require("celebrate");

// Example validation for a user creation route using celebrate
const createUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Enter a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    name: Joi.string().required().messages({
      "any.required": "Name is required",
    }),
  }),
});

module.exports = {
  createUserValidator,
};
