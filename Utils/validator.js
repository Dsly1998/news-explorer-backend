// validator

const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Example validation for a user creation route using celebrate and validator
const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .custom((value, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "Custom Email Validation")
      .messages({
        "string.email": "Enter a valid email address",
        "any.required": "Email is required",
        "any.invalid": "Invalid email format",
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
