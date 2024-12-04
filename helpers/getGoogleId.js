const { OAuth2Client } = require("google-auth-library");
const { httpError } = require('./httpError');

const getGoogleId = async ({token, platform}) => {
    const googleClient = new OAuth2Client();
    const { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } = process.env;

    let clientId;

    if (platform === 'android') {
        clientId = GOOGLE_ANDROID_CLIENT_ID;
    } else if (platform === 'ios') {
        clientId = GOOGLE_IOS_CLIENT_ID;
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: clientId,
    });

    if (!ticket) {
        throw httpError(401, "Invalid Google token");
    }

    const payload = ticket.getPayload();
    const data = {
        google_id: payload.sub,
    }
    payload.email && (data.email = payload.email);

    return data;
};

module.exports = getGoogleId;
