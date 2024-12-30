const { OAuth2Client } = require("google-auth-library");
const httpError = require('./httpError');
const { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } = process.env;

const getGoogleId = async ({ token, platform }) => {
    try {
        let clientId;

        if (platform === 'ios') {
            clientId = GOOGLE_IOS_CLIENT_ID; 
        } else if (platform === 'android') {
            clientId = GOOGLE_ANDROID_CLIENT_ID; 
        }
        
        const googleClient = new OAuth2Client();

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: clientId,
        });        
        const payload = ticket.getPayload();

        const data = {
            google_id: payload.sub,
        }
        payload.email && (data.email = payload.email);

        return data;
    } catch (error) {
        console.error(error.message);
        throw httpError(401, "Invalid Google token");
    }
    
    // let clientId;

    // if (platform === 'android') {
    //     clientId = GOOGLE_ANDROID_CLIENT_ID;
    // } else if (platform === 'ios') {
    //     clientId = GOOGLE_IOS_CLIENT_ID;
    // }

    // const googleClient = new OAuth2Client();

    // const ticket = await googleClient.verifyIdToken({
    //     idToken: token,
    //     audience: clientId,
    // });

    // if (!ticket) {
    //     throw httpError(401, "Invalid Google token");
    // }

    // const payload = ticket.getPayload();
    // const data = {
    //     google_id: payload.sub,
    // }
    // payload.email && (data.email = payload.email);

    // return data;
};

module.exports = getGoogleId;
