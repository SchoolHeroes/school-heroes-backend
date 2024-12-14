const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Ви перевищили ліміт запитів. Спробуйте пізніше.',
    standardHeaders: true, 
    legacyHeaders: false, 
});

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Ви перевищили ліміт спроб реєстрації. Спробуйте через 15 хвилин.',
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: 'Ви перевищили ліміт спроб входу. Спробуйте через 15 хвилин.',
});

const verifyEmailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: 'Ви перевищили ліміт спроб підтвердження адреси електронної пошти. Спробуйте через 15 хвилин.',
});

const recoveryPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: 'Ви перевищили ліміт спроб відновлення паролю. Спробуйте через 15 хвилин.',
});

module.exports = {
    apiLimiter,
    registrationLimiter,
    loginLimiter,
    verifyEmailLimiter,
    recoveryPasswordLimiter,
}