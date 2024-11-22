const express = require('express');
const ctrl = require('../../controllers/auth');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, phone, password, googleToken, appleToken } = req.body;
    ctrl.validateLoginData(email, phone, password, googleToken, appleToken, res)
})

module.exports = router;