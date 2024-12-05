const fs = require("fs/promises");
const { httpError } = require("../helpers");

const checkFileSize = async (req, res, next) => {
  const { file } = req;
  const maxFileSize = 8 * 1024 * 1024;

  if (!file) {
    next();
  } else if (file.size > maxFileSize) {
    await fs.unlink(file.path);
    next(httpError(400, "File size exceeds 8 MB"));
  } else {
    next();
  }
};

module.exports = checkFileSize;
