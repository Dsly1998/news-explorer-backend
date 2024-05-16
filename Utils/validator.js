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

const validateArticleCreation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    author: Joi.allow(null).required(),
    content: Joi.string().required(),
    description: Joi.string().required(),
    publishedAt: Joi.string().isoDate(),
    searchKeyword: Joi.string(),
    source: Joi.object({
      id: Joi.allow(null), // Allow null values
      name: Joi.string().required(),
    }),
    title: Joi.string().required(),
    url: Joi.string().uri(),
    urlToImage: Joi.string().uri(),
  }),
});

const validateArticleDeletion = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  createUserValidator,
  validateLogin,
  validateArticleCreation,
  validateArticleDeletion,
};
