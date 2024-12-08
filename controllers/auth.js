const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const { PrismaClient } = require('@prisma/client');
const { httpError, ctrlWrapper, sendEmail, getGoogleId, getAppleId } = require('../helpers');
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../helpers/cloudinary");
require('dotenv').config();

const { JWT_SECRET_KEY, BASE_SERVER_URL } = process.env;

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, { expiresIn: "24h" });
};

const register = async (req, res) => {
  const { file } = req;
  const data = req.body;
  
  const downloadedFile = await uploadFileToCloudinary(file);
  const fileURL = downloadedFile.secure_url;
  data.avatar = fileURL;

  const { method, email, password } = data;

  if (method === 'email') {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.verify_email) {
      throw httpError(409, "Email already in use");
    }

    let verificationToken;

    if (user && !user.verify_email) {
      verificationToken = user.verification_token;
    }
    
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword;

      verificationToken = nanoid();
      data.verification_token = verificationToken;

      await prisma.user.create({data});
    }

    const verifyEmail = {
        to: [{email}],
        subject: "Підтвердження адреси електронної пошти у додатку «Школа Героїв»",
        html: `
            <p>
                <a target="_blank" href="${BASE_SERVER_URL}/api/auth/verify/${verificationToken}">Натисніть тут</a> для підтвердження адреси вашої електронної пошти
            </p>
            `
    };

    await sendEmail(verifyEmail);

    return res.status(200).json({
        message: 'We have sent you a verification email. Please confirm your email.'
    });
  }
  
  const newUser = await prisma.user.create({data});

  const jwtToken = generateToken(newUser.id);

  res.status(201).json({ token: jwtToken, user: newUser });
};

const emailAuth = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

    if (!user) {
      throw httpError(401, "Invalid Email");
    }
  
    if (!user.verify_email) {
        throw httpError(403, "Email not verified");
    }
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    
    if (!passwordCompare) {
      throw httpError(401, 'Invalid password');
    }

    if (user.method !== 'email') {
      await prisma.user.update({
        where: { id: user.id },
        data: { method: 'email' },
      });
    }

  const jwtToken = generateToken(user.id);

  res.status(200).json({ token: jwtToken, user });
};

const googleAuth = async (req, res) => {
  const { token, platform } = req.body;
  const data = getGoogleId({token, platform});
  const { google_id, email } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { google_id },
        { email },
      ],
    },
  });

    if (!user) {
      return res.status(202).json({ message: "Please provide additional information to complete registration in the app.", data });
    }
  
  let updatedUser = user;

    if (user.google_id === google_id && !user.email && email) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    } else if (user.email === email && !user.google_id) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { google_id, method: 'google' },
      });
    } 
  
  const jwtToken = generateToken(updatedUser.id);

  const authUserInfo =
  {
          "_id": updatedUser.id,
          "method": updatedUser.method,
          "email": updatedUser.email,
          "role": updatedUser.role,
          "name": updatedUser.name,
          "phone": updatedUser.phone,
          "country": updatedUser.country,
          "city": updatedUser.city,
          "avatar": updatedUser.avatar
  }

  if(updatedUser.role === "speaker"){
    authUserInfo.activity = updatedUser.activity
  } else {
    authUserInfo.birthday = updatedUser.birthday
  }

  res.status(200).json({ token: jwtToken, user: authUserInfo });
};

const appleAuth = async (req, res) => {
  const { token } = req.body;
  const data = getAppleId(token);
  const { apple_id, email } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { apple_id },
        { email },
      ],
    },
  });

    if (!user) {
      return res.status(202).json({ message: "Please provide additional information to complete registration in the app.", data });
    }
  
  let updatedUser = user;

    if (user.apple_id === apple_id && !user.email && email) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    } else if (user.email === appleEmail && !user.apple_id) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { apple_id, method: 'apple' },
      });
    } 
  
  const jwtToken = generateToken(updatedUser.id);

  res.status(200).json({ token: jwtToken, user: updatedUser });
};

module.exports = {
  register: ctrlWrapper(register),
  emailAuth: ctrlWrapper(emailAuth),
  googleAuth: ctrlWrapper(googleAuth),
  appleAuth: ctrlWrapper(appleAuth),
}
