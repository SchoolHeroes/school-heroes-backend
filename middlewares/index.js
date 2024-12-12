const validateBody = require('./validateBody');
const upload = require('./upload');
const checkFileSize = require('./checkFileSize');
const detectLanguageByIP = require('./detectLanguageByIP');
const detectLangByHeader = require('./detectLangByHeader');

module.exports = {
    validateBody,
    upload,
    checkFileSize,
    detectLanguageByIP,
    detectLangByHeader,
}
