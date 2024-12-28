const jwt = require("jsonwebtoken");
const { httpError } = require('./httpError');
const { APPLE_ANDROID_CLIENT_ID, APPLE_IOS_CLIENT_ID } = process.env;

const getAppleId = (token, platform) => {
  let clientId;

  if (platform === 'ios') {
      clientId = APPLE_IOS_CLIENT_ID; 
  } else if (platform === 'android') {
      clientId = APPLE_ANDROID_CLIENT_ID; 
  }
  
  const { payload } = jwt.decode(token, { complete: true });

  if (
      !payload ||
      payload.aud !== clientId ||
      payload.exp * 1000 < Date.now()
  ) {
      throw httpError(401, "Error verifying Apple token");
  }

  const data = {
      apple_id: payload.sub,
  };
  payload.email && (data.email = payload.email);

  return data;
};

module.exports = getAppleId;
