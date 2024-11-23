const express = require('express');
const validateLoginDataMiddleware = require('../../middlewares/validateData')

const router = express.Router();

router.post('/login', validateLoginDataMiddleware, (req, res) => res.status(200).json({ message: "Login successful" }));

module.exports = router;