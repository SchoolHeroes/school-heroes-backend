const express = require('express');
const ctrl = require('../../controllers/auth');
const { registerSchema, loginSchema } = require("../../sсhemas/auth");
const { validateBody } = require("../../middlewares");

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrl.register);

router.post("/login", validateBody(loginSchema), ctrl.login);

module.exports = router;