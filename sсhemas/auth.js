const Joi = require('joi');
const {
    emailRegexp,
    phoneRegexp,
    passwordRegex,
    countryRegexp,
    locationRegexp,
} = require("../utils/regexp");

const registerSchema = (messages) => {
  return Joi.object({
    method: Joi.string().valid("email", "google", "apple").required(),
    
    name: Joi.string().min(2).max(55).required(),
    role: Joi.string().valid("child", "speaker").required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    country: Joi.string().pattern(countryRegexp).required().messages({
      "string.pattern.base": messages["country_string.pattern.base"],
      "any.required": messages["country_any.required"],
    }),
    city: Joi.string().pattern(locationRegexp).required(),

    email: Joi.string().pattern(emailRegexp).when('method', {
      is: 'email',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    password: Joi.string().min(8).max(24).pattern(passwordRegex).when('method', {
      is: 'email',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),

    google_id: Joi.string().when('method', {
      is: "google",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),

    apple_id: Joi.string().when('method', {
      is: "apple",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),

    birthday: Joi.date().iso().when('role', {
      is: 'child',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    activity: Joi.string().max(55).when('role', {
      is: 'speaker',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });
}; 

const emailAuthSchema = Joi.object({
  password: Joi.string().min(8).max(24).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

const tokenAuthSchema = Joi.object({
  token: Joi.string().required(),
  platform: Joi.string().valid("android", "ios").required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

// const updateUserSchema = Joi.object({
//   passions: Joi.string().default(''),
//   address: Joi.string().default(''),
// });

module.exports = {
  registerSchema,
  emailAuthSchema,
  tokenAuthSchema,
  emailSchema,
};
