const appleSignin = require('apple-signin-auth');
const httpError = require('./httpError');
const { APPLE_ANDROID_CLIENT_ID, APPLE_IOS_CLIENT_ID } = process.env;
// const jwt = require("jsonwebtoken");

const getAppleId = async (token, platform) => {
    try {
        let clientId;

        if (platform === 'ios') {
            clientId = APPLE_IOS_CLIENT_ID; 
        } else if (platform === 'android') {
            clientId = APPLE_ANDROID_CLIENT_ID; 
        }
        
        const payload = await appleSignin.verifyIdToken(token, {
            audience: clientId,
            ignoreExpiration: false, 
        });

        // const { payload } = jwt.decode(token, { complete: true });

        // if (!payload || payload.aud !== clientId || payload.exp * 1000 < Date.now()) {
        //     throw httpError(401, "Error verifying Apple token");
        // }
        
        const data = {
            apple_id: payload.sub,
        };
        payload.email && (data.email = payload.email);

        return data;
    } catch (error) {
        console.error(error.message);
        throw httpError(401, "Invalid Apple token");
    }
};

module.exports = getAppleId;
