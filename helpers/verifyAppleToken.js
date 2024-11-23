const jwt = require("jsonwebtoken");

const verifyAppleToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.payload) {
      return false;
    }

    if (decoded.payload.aud !== process.env.APPLE_CLIENT_ID) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Помилка при перевірці токена Apple:", error);
    return false;
  }
};

module.exports = verifyAppleToken;
