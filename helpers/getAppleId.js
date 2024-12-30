const appleSignin = require('apple-signin-auth');
const httpError = require('./httpError');
const { APPLE_ANDROID_CLIENT_ID, APPLE_IOS_CLIENT_ID } = process.env;

const getAppleId = async (token, platform) => {
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

  if (!payload) {
      throw httpError(401, "Invalid Apple token");
  }

  const data = {
      apple_id: payload.sub,
  };
  payload.email && (data.email = payload.email);

  return data;
};

module.exports = getAppleId;
