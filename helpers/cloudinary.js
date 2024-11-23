const cloudinary = require("cloudinary").v2;
const { httpError } = require("./httpError");
const fs = require("fs/promises");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadFileToCloudinary = async (file) => {
  const { path, mimetype, originalname } = file;

  try {
    let resourceType = 'image';  

    if (mimetype.startsWith('video/') || mimetype.startsWith('audio/')) {
      resourceType = 'video';
    } else if (!mimetype.startsWith('image/')) {
      resourceType = 'raw';  
    }

    const result = await cloudinary.uploader.upload(path, {
      resource_type: resourceType, 
      quality: resourceType === 'image' ? 80 : undefined
    });

    fs.unlink(path);

    return result;
  } catch (error) {
    throw httpError(400, "Error saving file");
  }
};

const deleteFileFromCloudinary = async (fileUrlFromCloudinary) => {
  try {
    const lastDotIndex = fileUrlFromCloudinary.lastIndexOf(".");
    const lastSlashIndex = fileUrlFromCloudinary.lastIndexOf("/");
    const fileId = fileUrlFromCloudinary.substring(
      lastSlashIndex + 1,
      lastDotIndex
    );
    await cloudinary.uploader.destroy(fileId);
  } catch (error) {
    throw httpError(400, "Error deleting file");
  }
};

module.exports = { uploadFileToCloudinary, deleteFileFromCloudinary };