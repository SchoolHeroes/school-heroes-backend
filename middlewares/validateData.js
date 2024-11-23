const ctrl = require('../controllers/auth');

const validateLoginDataMiddleware = (req, res, next) => {
    const { email, password, googleToken, appleToken } = req.body;

    const loginMethods = {
        "Email and Password": ctrl.loginWithEmailAndPassword,
        "Google Login": ctrl.loginWithGoogle,
        "Apple Login": ctrl.loginWithApple,
    };

    for (const controller of Object.entries(loginMethods)) {
        const result = controller({ email, phone, password, googleToken, appleToken });
        if (result) {
            return next();
        }
    }
    res.status(400).json({ message: "Invalid login credentials" });
}

module.exports = validateLoginDataMiddleware;