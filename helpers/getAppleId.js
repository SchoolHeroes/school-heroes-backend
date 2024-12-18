const jwt = require("jsonwebtoken");
const { httpError } = require('./httpError');

const getAppleId = (token) => {
    const { payload } = jwt.decode(token, { complete: true });

  if (
      payload ||
      payload.aud !== process.env.APPLE_CLIENT_ID ||
      payload.exp < Date.now()
    ) {
      throw httpError(401, "Error verifying Apple token");
    }

    const data = {
        apple_id: payload.sub,
    }
    payload.email && (data.email = payload.email);

    return data;
};

module.exports = getAppleId;
