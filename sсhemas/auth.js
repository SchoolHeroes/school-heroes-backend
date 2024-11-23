const Joi = require('joi');
const {
    emailRegexp,
    dateRegexp,
    phoneRegexp,
    passwordRegex,
    locationRegexp,
} = require("../utils");

const registerSchema = Joi.object({
  method: Joi.string().valid("email", "google", "apple").required(),
  
  // Поля для всіх методів
  name: Joi.string().min(2).max(30).required(),
  role: Joi.string().valid("child", "speaker").required(),
  phone: Joi.string().pattern(phoneRegexp).required(),
  country: Joi.string().pattern(locationRegexp).required(),
  city: Joi.string().pattern(locationRegexp).required(),

  // Поля для методу email
  email: Joi.when('method', {
    is: 'email',
    then: Joi.string().pattern(emailRegexp).required(),
    otherwise: Joi.string().optional(),
  }),
  password: Joi.when('method', {
    is: 'email',
    then: Joi.string().min(8).max(24).pattern(passwordRegex).required(),
    otherwise: Joi.string().optional(),
  }),

  // Поля для методів Google/Apple
  token: Joi.when('method', {
    is: Joi.valid("google", "apple"),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  // Поля, залежні від role
  birthday: Joi.string().pattern(dateRegexp).when('role', {
    is: 'child',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  activity: Joi.string().when('role', {
    is: 'speaker',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Необов'язкові поля
  passions: Joi.string().default(''),
  address: Joi.string().default(''),
});

const loginSchema = Joi.object({
  method: Joi.string().valid("email", "google", "apple").required(),
  email: Joi.when('method', {
    is: 'email',
    then: Joi.string().pattern(emailRegexp).required(),
    otherwise: Joi.string().optional(),
  }),
  password: Joi.when('method', {
    is: 'email',
    then: Joi.string().min(8).max(24).required(),
    otherwise: Joi.string().optional(),
  }),
  token: Joi.when('method', {
    is: Joi.valid("google", "apple"),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    emailSchema,
};