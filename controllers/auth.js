const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const { PrismaClient } = require('@prisma/client');
const { httpError, ctrlWrapper, sendEmail, getGoogleId, getAppleId } = require('../helpers');
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../helpers/cloudinary");
require('dotenv').config();

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
};

const register = async (req, res) => {
  const { file } = req;
  const data = req.body;
  
  const { method, email, password } = data;

  if (method === 'email') {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw httpError(409, "Email already in use");
    }     
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
  }

  const downloadedFile = await uploadFileToCloudinary(file);

  const fileURL = downloadedFile.secure_url;
  data.avatar = fileURL;
  
  const newUser = await prisma.user.create({data});

  const jwtToken = generateToken(newUser.id);

  res.status(201).json({ token: jwtToken, newUser });
};

const emailAuth = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

    if (!user) {
      throw httpError(401, "Invalid Email");
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
  const { token } = req.body;
  const data = getGoogleId(token);
  const { googleId, googleEmail } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { google_id: googleId },
        { email: googleEmail },
      ],
    },
  });

    if (!user) {
      return res.status(200).json({ message: "Additional information is required for registration.", data });
    }
  
  let updatedUser = user;

    if (user.google_id === googleId && !user.email && googleEmail) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { email: googleEmail },
      });
    } else if (user.email === googleEmail && !user.google_id) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { google_id: googleId, method: 'google' },
      });
    } 
  
  const jwtToken = generateToken(updatedUser.id);

  res.status(200).json({ token: jwtToken, user: updatedUser });
};

const appleAuth = async (req, res) => {
  const { token } = req.body;
  const data = getAppleId(token);
  const { appleId, appleEmail } = data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { apple_id: appleId },
        { email: appleEmail },
      ],
    },
  });

    if (!user) {
      return res.status(200).json({ message: "Additional information is required for registration.", data });
    }
  
  let updatedUser = user;

    if (user.apple_id === appleId && !user.email && appleEmail) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { email: appleEmail },
      });
    } else if (user.email === appleEmail && !user.apple_id) {
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { apple_id: appleId, method: 'apple' },
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
