const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

const createUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email({ tlds: { allow: false } }) // This disables TLD validation if you don't need it.
      .required()
      .custom((value, helpers) => {
        // validator.isEmail comes with options that can be useful.
        if (!validator.isEmail(value, { allow_utf8_local_part: false })) {
          return helpers.error("any.invalid");
        }
        return value; // Only return the value if it's valid.
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

const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateArticle = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required().messages({
      "string.base": "Title must be a string.",
      "any.required": "Title is required.",
    }),
    content: Joi.string().required().messages({
      "string.base": "Content must be a string.",
      "any.required": "Content is required.",
    }),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = { createUserValidator, validateLogin, validateArticle };
