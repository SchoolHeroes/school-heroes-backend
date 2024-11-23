const { OAuth2Client } = require("google-auth-library");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const {nanoid} = require('nanoid');
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');
const verifyAppleToken = require('../helpers/verifyAppleToken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
};

const register = async (req, res) => {
    const { method, email, password, token, name, role, phone, country, city, birthday, activity, passions, address } =
      req.body;

    let user;

    if (method === "email") {      
        // Перевірка користувача за email
        
        const hashedPassword = await bcrypt.hash(password, 10);

         // Створення нового користувача
    }

    if (method === "google") {
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email: googleEmail } = payload;

      // Перевірка користувача за email та створення нового користувача
    }

    if (method === "apple") {
      const isValid = verifyAppleToken(token); 
      
        if (!isValid) {
            throw httpError(401, "Invalid Apple token");
        }

      // Перевірка користувача за email та створення нового користувача
    }

    // Збереження користувача

    const verificationToken = nanoid();
    const verifyEmail = {
        to: [{email}],
        subject: "Підтвердження адреси електронної пошти у додатку «Школа Героїв»",
        html: `
            <p>
                <a target="_blank" href="${process.env.BASE_SERVER_URL}/api/auth/verify/${verificationToken}">Натисніть тут</a> для підтвердження адреси вашої електронної пошти
            </p>
            `
    };

    await sendEmail(verifyEmail);

    const jwtToken = generateToken(user._id);

    res.status(201).json({ token: jwtToken, user });
};

const login = async (req, res) => {

};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}