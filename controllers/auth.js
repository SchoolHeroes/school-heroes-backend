const validateLoginData = ({ email, phone, password, googleToken, appleToken, res }) => {
    const loginMethods = {
        "Email and Password": ctrl.loginWithEmailAndPassword,
        "Phone and Password": ctrl.loginWithPhoneAndPassword,
        "Google Login": ctrl.loginWithGoogle,
        "Apple Login": ctrl.loginWithApple,
    };

    for (const controller of Object.entries(loginMethods)) {
        const result = controller({ email, phone, password, googleToken, appleToken });
        if (result) {
            res.status(200).json("Success login");
            return
        }
    }
    res.status(400).json({ message: "Invalid login credentials" });
};

const loginWithEmailAndPassword = ({ email, password }) => {
    if (email && password) {
        // Логіка авторизації емейлу і пароля
    } else {
        return
    }
}

const loginWithPhoneAndPassword = ({ phone, password }) => {
    if (phone && password) {
        // Логіка авторизації телефона і пароля
    } else {
        return
    }
}

const loginWithGoogle = ({ googleToken }) => {
    if (googleToken) {
        // Логіка авторизації з гугл акаунта
    } else {
        return
    }
}

const loginWithApple = ({ appleToken }) => {
    if (appleToken) {
        // Логіка авторизації з епл акаунта
    } else {
        return
    }
}

module.exports = {
    validateLoginData,
    loginWithEmailAndPassword,
    loginWithPhoneAndPassword,
    loginWithGoogle,
    loginWithApple,
};