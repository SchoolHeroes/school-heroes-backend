// const detectLangByHeader = (req, res, next) => {
//     console.log(req.headers);
    
//     const acceptedLanguages = req.headers['accept-language'];
//     console.log('acceptedLanguages', acceptedLanguages);
    
//     const defaultLanguage = 'en';
//     const supportedLanguages = ['uk', 'en'];

//     const preferredLanguage = acceptedLanguages?.split(',')[0].split('-')[0] || defaultLanguage;

//     req.language = supportedLanguages.includes(preferredLanguage) ? preferredLanguage : defaultLanguage;

//     next();
// };

const detectLangByHeader = (req, res, next) => {
    const acceptedLanguages = req.headers['accept-language'];

    const defaultLanguage = 'en';
    const supportedLanguages = ['uk', 'en'];

    // Якщо мова вже збережена в сесії, використовуємо її
    if (req.session.language && supportedLanguages.includes(req.session.language)) {
        req.language = req.session.language;
    } else {
        // Визначаємо мову з Accept-Language або ставимо мову за замовчуванням
        const preferredLanguage = acceptedLanguages?.split(',')[0].split('-')[0] || defaultLanguage;

        req.language = supportedLanguages.includes(preferredLanguage) ? preferredLanguage : defaultLanguage;

        // Зберігаємо вибрану мову в сесії
        req.session.language = req.language;
    }

    next();
};

module.exports = detectLangByHeader;


