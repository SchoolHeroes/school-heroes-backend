const detectLangByHeader = (req, res, next) => {
    console.log(req.headers);
    
    const acceptedLanguages = req.headers['accept-language'];
    console.log('acceptedLanguages', acceptedLanguages);
    
    const defaultLanguage = 'en'; 
    const supportedLanguages = ['uk', 'en']; 

    const preferredLanguage = acceptedLanguages?.split(',')[0].split('-')[0] || defaultLanguage;

    req.language = supportedLanguages.includes(preferredLanguage) ? preferredLanguage : defaultLanguage;

    next();
};

module.exports = detectLangByHeader;


