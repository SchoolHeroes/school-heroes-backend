const validateBody = require('./validateBody');
const upload = require('./upload');
const checkFileSize = require('./checkFileSize');
const detectLanguageByIP = require('./detectLanguageByIP');

module.exports = {
    validateBody,
    upload,
    checkFileSize,
    detectLanguageByIP,
}
