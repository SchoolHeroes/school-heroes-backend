const express = require('express');
const ctrl = require('../../controllers/auth');
const { registerSchema, emailAuthSchema, tokenAuthSchema, emailSchema } = require("../../sсhemas/auth");
const { validateBody, upload, checkFileSize } = require("../../middlewares");
const {
    registrationLimiter,
    loginLimiter,
    verifyEmailLimiter,
    recoveryPasswordLimiter
} = require("../../middlewares/limiter");

const router = express.Router();

router.post("/register", registrationLimiter, upload.single("file"), checkFileSize, validateBody(registerSchema), ctrl.register);

router.post("/login", loginLimiter, validateBody(emailAuthSchema), ctrl.emailAuth);

router.post("/google", validateBody(tokenAuthSchema), ctrl.googleAuth);

router.post("/apple", validateBody(tokenAuthSchema), ctrl.appleAuth);

router.post("/verify", verifyEmailLimiter, validateBody(emailSchema), ctrl.resendVerifyEmail);

router.get("/interval", (req, res) => { 
    res.json({message: "Server online"});
});

module.exports = router;
