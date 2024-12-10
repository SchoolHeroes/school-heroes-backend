const express = require('express');
const ctrl = require('../../controllers/auth');
const { registerSchema, emailAuthSchema, tokenAuthSchema } = require("../../sсhemas/auth");
const { validateBody, upload, checkFileSize } = require("../../middlewares");

const router = express.Router();

router.post("/register", upload.single("file"), checkFileSize, validateBody(registerSchema), ctrl.register);

router.post("/login", validateBody(emailAuthSchema), ctrl.emailAuth);

router.post("/google", validateBody(tokenAuthSchema), ctrl.googleAuth);

router.post("/apple", validateBody(tokenAuthSchema), ctrl.appleAuth);

router.get("/interval", (req, res) => { 
    res.json({message: "Server online"});
});

module.exports = router;
