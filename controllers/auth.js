const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const { PrismaClient } = require('@prisma/client');
const { httpError, ctrlWrapper, sendEmail, getGoogleId, getAppleId } = require('../helpers');
require('dotenv').config();

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
};

const register = async (req, res) => {
  const { method, email, password, token, role, name, phone, country, city, birthday, activity } = req.body;
  const data = Object.fromEntries(
    Object.entries({ method, email, role, name, phone, country, city, birthday, activity })
      .filter(([key, value]) => value !== undefined)
  );

    if (method === "email") {      
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        throw httpError(409, "Email already in use");
      }     
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword;
    }

    if (method === "google") {
      const googleId = getGoogleId(token);

      const user = await prisma.user.findUnique({
        where: { google_id: googleId },
      });

      if (user) {
        throw httpError(409, "A user with this Google ID is already registered");
      }     
      data.google_id = googleId;
    }

    if (method === "apple") {
      const appleId = getAppleId(token);

      const user = await prisma.user.findUnique({
        where: { apple_id: appleId },
      });

      if (user) {
        throw httpError(409, "A user with this Apple ID is already registered");
      }     
      data.apple_id = appleId;
    }

    const newUser = await prisma.user.create({data});

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

    const jwtToken = generateToken(newUser.id);

    res.status(201).json({ token: jwtToken, newUser });
};

const login = async (req, res) => {

};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}