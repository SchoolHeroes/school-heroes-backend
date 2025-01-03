const detectLangByHeader = (req, res, next) => {
    const acceptedLanguages = req.headers['accept-language'];

    const defaultLanguage = 'en';
    const supportedLanguages = ['uk', 'en'];

    if (req.session.language && supportedLanguages.includes(req.session.language)) {
        req.language = req.session.language;
    } else {
        const preferredLanguage = acceptedLanguages?.split(',')[0].split('-')[0] || defaultLanguage;

        req.language = supportedLanguages.includes(preferredLanguage) ? preferredLanguage : defaultLanguage;

        req.session.language = req.language;
    }

    next();
};

module.exports = detectLangByHeader;


