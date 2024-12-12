const geoip = require('geoip-lite');

const detectLanguageByIP = (req, res, next) => {
  const ip = req.ip; 
  const geo = geoip.lookup(ip); 
  const country = geo?.country; 
  const languageMap = {
    UA: 'uk', 
    US: 'en', 
  };
  
  req.language = languageMap[country] || 'en';
  next();
};

module.exports = detectLanguageByIP;