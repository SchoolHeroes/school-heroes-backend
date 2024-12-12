const express = require('express');
const ctrl = require('../../controllers/auth');
const { registerSchema, emailAuthSchema, tokenAuthSchema, emailSchema } = require("../../sсhemas/auth");
const { validateBody, upload, checkFileSize, detectLanguageByIP } = require("../../middlewares");

const router = express.Router();

router.post("/register", detectLanguageByIP, upload.single("file"), checkFileSize, validateBody(registerSchema), ctrl.register);

router.post("/login", detectLanguageByIP, validateBody(emailAuthSchema), ctrl.emailAuth);

router.post("/google", detectLanguageByIP, validateBody(tokenAuthSchema), ctrl.googleAuth);

router.post("/apple", detectLanguageByIP, validateBody(tokenAuthSchema), ctrl.appleAuth);

router.post("/verify", detectLanguageByIP, validateBody(emailSchema), ctrl.resendVerifyEmail);

router.get("/interval", (req, res) => { 
    res.json({message: "Server online"});
});

module.exports = router;
