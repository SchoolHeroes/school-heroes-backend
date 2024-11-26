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

  const jwtToken = generateToken(user.id);

  res.status(200).json({ token: jwtToken, user });
};

const googleAuth = async (req, res) => {
  const { token } = req.body;
  const googleId = getGoogleId(token);

  const user = await prisma.user.findUnique({
    where: { google_id: googleId },
  });

    if (!user) {
      return res.status(200).json({ message: "Additional info required", googleId });
    }
  
  const jwtToken = generateToken(user.id);

  res.status(200).json({ token: jwtToken, user });
};

const appleAuth = async (req, res) => {
  const { token } = req.body;
  const appleId = getAppleId(token);

  const user = await prisma.user.findUnique({
    where: { apple_id: appleId },
  });

    if (!user) {
      return res.status(200).json({ message: "Additional info required", appleId });
    }
  
  const jwtToken = generateToken(user.id);

  res.status(200).json({ token: jwtToken, user });
};

module.exports = {
  register: ctrlWrapper(register),
  emailAuth: ctrlWrapper(emailAuth),
  googleAuth: ctrlWrapper(googleAuth),
  appleAuth: ctrlWrapper(appleAuth),
}
