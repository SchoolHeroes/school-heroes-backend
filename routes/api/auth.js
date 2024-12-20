const express = require('express');
const ctrl = require('../../controllers/auth');
const { registerSchema, emailAuthSchema, tokenAuthSchema, emailSchema, confirmPasswordSchema } = require("../../sсhemas/auth");
const { validateBody, upload, checkFileSize } = require("../../middlewares");
const {
    registrationLimiter,
    loginLimiter,
    verifyEmailLimiter,
    resetPasswordLimiter
} = require("../../middlewares/limiter");

const router = express.Router();

router.post("/register", registrationLimiter, upload.single("file"), checkFileSize, validateBody(registerSchema), ctrl.register);

router.post("/login", loginLimiter, validateBody(emailAuthSchema), ctrl.emailAuth);

router.post("/google", validateBody(tokenAuthSchema), ctrl.googleAuth);

router.post("/apple", validateBody(tokenAuthSchema), ctrl.appleAuth);

router.post("/verify", verifyEmailLimiter, validateBody(emailSchema), ctrl.resendVerifyEmail);

router.patch("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/reset-password", resetPasswordLimiter, validateBody(emailSchema), ctrl.resetPassword);

router.post("/confirm-password", validateBody(confirmPasswordSchema), ctrl.confirmPassword);

router.get("/interval", (req, res) => { 
    res.json({message: "Server online"});
});

module.exports = router;
