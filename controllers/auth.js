const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const { PrismaClient } = require('@prisma/client');
const { httpError, ctrlWrapper, sendEmail, getGoogleId, getAppleId } = require('../helpers');
const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../helpers/cloudinary");
const messages = require('../utils/messages.json');
require('dotenv').config();

const { JWT_SECRET_KEY, BASE_SERVER_URL, BASE_CLIENT_URL } = process.env;

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, { expiresIn: "24h" });
};

const register = async (req, res) => {
  const langMessages = messages[req.language];
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
      const errorMessage = langMessages.email_use;
      throw httpError(409, errorMessage);
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
      to: [{ email }],
      subject: "Підтвердження адреси електронної пошти у додатку «Школа Героїв»",
      html: `
            <p>
              <a target="_blank" href="${BASE_SERVER_URL}/api/auth/verify/${verificationToken}">Натисніть тут</a> для підтвердження адреси вашої електронної пошти
            </p>
            `
    };

    await sendEmail(verifyEmail);

    return res.status(200).json({
        message: langMessages.sent_verification_email
    });
  }
  
  const newUser = await prisma.user.create({data});

  const jwtToken = generateToken(newUser.id);

  const authUserInfo =
  {
          "_id": newUser.id,
          "method": newUser.method,
          "email": newUser.email,
          "role": newUser.role,
          "name": newUser.name,
          "phone": newUser.phone,
          "country": newUser.country,
          "city": newUser.city,
          "avatar": newUser.avatar
  }

  if(newUser.role === "speaker"){
    authUserInfo.activity = newUser.activity
  } else if(newUser.role === "child"){
    authUserInfo.birthday = newUser.birthday
  }

  res.status(201).json({ token: jwtToken, user: authUserInfo });
};

const emailAuth = async (req, res) => {
  const langMessages = messages[req.language];
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
      const errorMessage = langMessages.invalid_email;
      throw httpError(401, errorMessage);
    }
  
  if (!user.verify_email) {
      const errorMessage = langMessages.email_not_verified;
      throw httpError(403, errorMessage);
    }
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    
  if (!passwordCompare) {
      const errorMessage = langMessages.invalid_password;
      throw httpError(401, errorMessage);
    }

    if (user.method !== 'email') {
      await prisma.user.update({
        where: { id: user.id },
        data: { method: 'email' },
      });
    }

  const jwtToken = generateToken(user.id);

  const authUserInfo =
  {
          "_id": user.id,
          "method": user.method,
          "email": user.email,
          "role": user.role,
          "name": user.name,
          "phone": user.phone,
          "country": user.country,
          "city": user.city,
          "avatar": user.avatar
  }

  if(user.role === "speaker"){
    authUserInfo.activity = user.activity
  } else if(user.role === "child"){
    authUserInfo.birthday = user.birthday
  }

  res.status(200).json({ token: jwtToken, user: authUserInfo });
};

const googleAuth = async (req, res) => {
  const langMessages = messages[req.language];
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
      return res.status(202).json({ message: langMessages.add_info_registration, data });
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
  } else if(updatedUser.role === "child"){
    authUserInfo.birthday = updatedUser.birthday
  }

  res.status(200).json({ token: jwtToken, user: authUserInfo });
};

const appleAuth = async (req, res) => {
  const langMessages = messages[req.language];
  const { token } = req.body;

  const data = await getAppleId(token);
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
      return res.status(202).json({ message: langMessages.add_info_registration, data });
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
  } else if(updatedUser.role === "child"){
    authUserInfo.birthday = updatedUser.birthday
  }

  res.status(200).json({ token: jwtToken, user: authUserInfo });
};

const resendVerifyEmail = async (req, res) => {
  const langMessages = messages[req.language];
  const {email} = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const errorMessage = langMessages.user_not_found;
    throw httpError(404, errorMessage);
  }

  if (user.verify_email) {
    const errorMessage = langMessages.email_verified;
    throw httpError(409, errorMessage);
  }

  const verifyEmail = {
    to: [{ email }],
    subject: "Підтвердження адреси електронної пошти у додатку «Школа Героїв»",
    html: `
        <p>
          <a target="_blank" href="${BASE_SERVER_URL}/api/auth/verify/${user.verification_token}">Натисніть тут</a> для підтвердження адреси вашої електронної пошти
        </p>
        `
  };
  
  await sendEmail(verifyEmail);

  res.status(200).json({
    message: langMessages.sent_verification_email
  });
};

const verifyEmail = async (req, res) => {
  const langMessages = messages[req.language];
  const {verificationToken} = req.params;
    
  const user = await prisma.user.findUnique({
    where: { verification_token: verificationToken },
  });

  if (!user) {
    const errorMessage = langMessages.user_not_found;
    throw httpError(404, errorMessage);
  }
  
  await prisma.user.update({
    where: { id: user.id },
    data: { verify_email: true, verification_token: null },
  });
  
  res.status(200).json({
    message: langMessages.email_verified_success,
  })
};

const resetPassword = async (req, res) => {
  const langMessages = messages[req.language];
  const {email} = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const errorMessage = langMessages.user_not_found;
    throw httpError(404, errorMessage);
  }

  const token = jwt.sign({userId: user.id}, JWT_SECRET_KEY, {expiresIn: '1h'});

  const resetPasswordEmail = {
    to: [{ email }],
    subject: "Відновлення паролю у додатку «Школа Героїв»",
    html: `
          <p>
              <a target="_blank" href="${BASE_CLIENT_URL}/reset-password?token=${token}">Натисніть тут</a> для відновлення паролю
          </p>
          `
  };

  await sendEmail(resetPasswordEmail);

  res.status(200).json({
    message: langMessages.sent_reset_password_email
  });
};

const confirmPassword = async (req, res) => {
  const langMessages = messages[req.language];
  const { token, password } = req.body;
  
  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    userId = decoded.userId;
  } catch (error) {
    const errorMessage = langMessages.invalid_jwt_token;
    throw httpError(400, errorMessage);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const errorMessage = langMessages.user_not_found;
    throw httpError(404, errorMessage);
  }

  const hasPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hasPassword },
  });

  const jwtToken = generateToken(user.id);

  const authUserInfo =
  {
          "_id": user.id,
          "method": user.method,
          "email": user.email,
          "role": user.role,
          "name": user.name,
          "phone": user.phone,
          "country": user.country,
          "city": user.city,
          "avatar": user.avatar
  }

  if(user.role === "speaker"){
    authUserInfo.activity = user.activity
  } else if(user.role === "child"){
    authUserInfo.birthday = user.birthday
  }

  res.status(200).json({ token: jwtToken, user: authUserInfo });
};

module.exports = {
  register: ctrlWrapper(register),
  emailAuth: ctrlWrapper(emailAuth),
  googleAuth: ctrlWrapper(googleAuth),
  appleAuth: ctrlWrapper(appleAuth),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  verifyEmail: ctrlWrapper(verifyEmail),
  resetPassword: ctrlWrapper(resetPassword),
  confirmPassword: ctrlWrapper(confirmPassword),
}
