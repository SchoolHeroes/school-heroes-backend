const express = require('express');
const ctrl = require('../../controllers/auth');
const { registerSchema, emailAuthSchema, tokenAuthSchema, emailSchema } = require("../../sсhemas/auth");
const { validateBody, upload, checkFileSize, detectLangByHeader } = require("../../middlewares");

const router = express.Router();

router.post("/register", detectLangByHeader, upload.single("file"), checkFileSize, validateBody(registerSchema), ctrl.register);

router.post("/login", validateBody(emailAuthSchema), ctrl.emailAuth);

router.post("/google", detectLangByHeader, validateBody(tokenAuthSchema), ctrl.googleAuth);

router.post("/apple", detectLangByHeader, validateBody(tokenAuthSchema), ctrl.appleAuth);

router.post("/verify", detectLangByHeader, validateBody(emailSchema), ctrl.resendVerifyEmail);

router.get("/interval", (req, res) => { 
    res.json({message: "Server online"});
});

module.exports = router;
