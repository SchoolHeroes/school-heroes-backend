const rateLimit = require('express-rate-limit');
// const Redis = require('ioredis');
// const { RedisStore } = require('rate-limit-redis');

// const redisClient = new Redis(process.env.REDIS_URL);

// redisClient.on('connect', () => {
//     console.log('Redis successfully connected');
// });
// redisClient.on('error', (err) => {
//     console.error('Redis Error:', err);
// });

const apiLimiter = rateLimit({
    // store: new RedisStore({
    //     sendCommand: (...args) => redisClient.call(...args),
    // }),
    windowMs: 2 * 60 * 1000, 
    max: 5, 
    // keyGenerator: (req) => {
    //     const forwarded = req.headers['x-forwarded-for'];
    //     const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.ip;
    //     return clientIp;
    // },
    message: 'Ви перевищили ліміт запитів. Спробуйте пізніше.',
    standardHeaders: true, 
    legacyHeaders: false, 
});

// const registrationLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.call(...args),
//     }),
//     windowMs: 15 * 60 * 1000, 
//     max: 5, 
//     message: 'Ви перевищили ліміт спроб реєстрації. Спробуйте через 15 хвилин.',
// });

// const loginLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.call(...args),
//     }),
//     windowMs: 15 * 60 * 1000, 
//     max: 10, 
//     message: 'Ви перевищили ліміт спроб входу. Спробуйте через 15 хвилин.',
// });

// const verifyEmailLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.call(...args),
//     }),
//     windowMs: 15 * 60 * 1000, 
//     max: 10, 
//     message: 'Ви перевищили ліміт спроб підтвердження адреси електронної пошти. Спробуйте через 15 хвилин.',
// });

// const recoveryPasswordLimiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.call(...args),
//     }),
//     windowMs: 15 * 60 * 1000, 
//     max: 10, 
//     message: 'Ви перевищили ліміт спроб відновлення паролю. Спробуйте через 15 хвилин.',
// });

module.exports = {
    apiLimiter,
    // registrationLimiter,
    // loginLimiter,
    // verifyEmailLimiter,
    // recoveryPasswordLimiter,
}