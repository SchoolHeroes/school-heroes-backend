const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { JWT_SECRET_KEY } = process.env;
const { httpError } = require('../helpers');

const prisma = new PrismaClient(); 

const authenticate = async (req, res, next) => {
    const langMessages = messages[req.language];
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
        throw httpError(401, langMessages.not_authorized);
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET_KEY);

        const [user, activeToken] = await Promise.all([
            prisma.user.findUnique({ where: { id } }),
            prisma.active_token.findUnique({ where: { token } }),
        ]);

        if (!user || !activeToken) {
            throw httpError(401, langMessages.not_authorized);
        }

        req.user = user;
        next();
    } catch (error) {
        throw httpError(401, langMessages.not_authorized);
    }
};

module.exports = authenticate;
