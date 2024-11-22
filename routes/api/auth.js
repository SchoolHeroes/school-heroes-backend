const express = require('express');
const ctrl = require('../../controllers/auth');

const router = express.Router();

router.post('/login', (req, res) => ctrl.validateLoginData({ ...req.body, res }));

module.exports = router;