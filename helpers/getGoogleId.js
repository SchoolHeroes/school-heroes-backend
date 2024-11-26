const { OAuth2Client } = require("google-auth-library");
const { httpError } = require('./httpError');

const getGoogleId = async (token) => {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
        throw httpError(401, "Invalid Google token");
    }

    const payload = ticket.getPayload();
    const googleId = payload.sub;

    return googleId;
};

module.exports = getGoogleId;
