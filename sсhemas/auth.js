const Joi = require('joi');
const {
  emailRegexp,
  phoneRegexp,
  passwordRegex,
  countryRegexp,
  locationRegexp,
  dateTimeRegexp,
} = require("../utils/regexp");

const registerSchema = (messages) => {
  return Joi.object({
    method: Joi.string().valid("email", "google", "apple").required().messages({
      "any.only": messages["method_any.only"],
      "any.required": messages["method_any.required"],
    }),
    
    name: Joi.string().min(2).max(55).required().messages({
      "string.empty": messages["name_string.empty"],
      "string.min": messages["name_string.min"],
      "string.max": messages["name_string.max"],
      "any.required": messages["name_any.required"],
    }),

    role: Joi.string().valid("child", "speaker").required().messages({
      "any.only": messages["role_any.only"],
      "any.required": messages["role_any.required"],
    }),

    phone: Joi.string().pattern(phoneRegexp).required().messages({
      "string.empty": messages["phone_string.empty"],
      "string.pattern.base": messages["phone_string.pattern.base"],
      "any.required": messages["phone_any.required"],
    }),

    country: Joi.string().pattern(countryRegexp).required().messages({
      "string.empty": messages["country_string.empty"],
      "string.pattern.base": messages["country_string.pattern.base"],
      "any.required": messages["country_any.required"],
    }),

    city: Joi.string().pattern(locationRegexp).required().messages({
      "string.empty": messages["city_string.empty"],
      "string.pattern.base": messages["city_string.pattern.base"],
      "any.required": messages["city_any.required"],
    }),

    email: Joi.string().pattern(emailRegexp).when('method', {
      is: 'email',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).messages({
      "string.empty": messages["email_string.empty"],
      "string.pattern.base": messages["email_string.pattern.base"],
      "any.required": messages["email_any.required"],
    }),
    password: Joi.string().min(8).max(24).pattern(passwordRegex).when('method', {
      is: 'email',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }).messages({
      "string.min": messages["password_string.min"],
      "string.max": messages["password_string.max"],
      "string.empty": messages["password_string.empty"],
      "string.pattern.base": messages["password_string.pattern.base"],
      "any.required": messages["password_any.required"],
    }),

    google_id: Joi.string().when('method', {
      is: "google",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }).messages({
      "string.empty": messages["google_id_string.empty"],
      "any.required": messages["google_id_any.required"],
    }),

    apple_id: Joi.string().when('method', {
      is: "apple",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }).messages({
      "string.empty": messages["apple_id_string.empty"],
      "any.required": messages["apple_id_any.required"],
    }),

    birthday: Joi.string().pattern(dateTimeRegexp).when('role', {
      is: 'child',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).messages({
      "string.pattern.base": messages["birthday_string.pattern.base"],
      "any.required": messages["birthday_any.required"],
    }),
    activity: Joi.string().max(55).when('role', {
      is: 'speaker',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }).messages({
      "string.empty": messages["activity_string.empty"],
      "string.max": messages["activity_string.max"],
      "any.required": messages["activity_any.required"],
    }),
  });
}; 

const emailAuthSchema = (messages) => {
  return Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
      "string.empty": messages["email_string.empty"],
      "string.pattern.base": messages["email_string.pattern.base"],
      "any.required": messages["email_any.required"],
    }),
    password: Joi.string().min(8).max(24).pattern(passwordRegex).required().messages({
      "string.min": messages["password_string.min"],
      "string.max": messages["password_string.max"],
      "string.empty": messages["password_string.empty"],
      "string.pattern.base": messages["password_string.pattern.base"],
      "any.required": messages["password_any.required"],
    }),
  }); 
};

const tokenAuthSchema = (messages) => {
  return Joi.object({
    token: Joi.string().required().messages({
      "string.empty": messages["token_string.empty"],
      "any.required": messages["token_any.required"],
    }),
    platform: Joi.string().valid("android", "ios").required().messages({
      "any.only": messages["platform_any.only"],
      "any.required": messages["platform_any.required"],
    }),
  });
}; 

const emailSchema = (messages) => {
  return Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
      "string.empty": messages["email_string.empty"],
      "string.pattern.base": messages["email_string.pattern.base"],
      "any.required": messages["email_any.required"],
    }),
  });
};

const confirmPasswordSchema = (messages) => {
  return Joi.object({
    token: Joi.string().required().messages({
      "string.empty": messages["token_string.empty"],
      "any.required": messages["token_any.required"],
    }),
    password: Joi.string().min(8).max(24).pattern(passwordRegex).required().messages({
      "string.min": messages["password_string.min"],
      "string.max": messages["password_string.max"],
      "string.empty": messages["password_string.empty"],
      "string.pattern.base": messages["password_string.pattern.base"],
      "any.required": messages["password_any.required"],
    }),
  });
};

// const updateUserSchema = Joi.object({
//   passions: Joi.string().default(''),
//   address: Joi.string().default(''),
// });

module.exports = {
  registerSchema,
  emailAuthSchema,
  tokenAuthSchema,
  emailSchema,
  confirmPasswordSchema,
};
