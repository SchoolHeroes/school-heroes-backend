const fs = require("fs/promises");
const { httpError } = require("../helpers");
const messages = require('../utils/messages.json');

const checkFileSize = async (req, res, next) => {
  const langMessages = messages[req.language];
  const { file } = req;
  const maxFileSize = 8 * 1024 * 1024;

  if (!file) {
    next();
  } else if (file.size > maxFileSize) {
    await fs.unlink(file.path);

    const errorMessage = langMessages.file_too_large;
    next(httpError(400, errorMessage));
  } else {
    next();
  }
};

module.exports = checkFileSize;
