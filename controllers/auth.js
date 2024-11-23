const loginWithEmailAndPassword = ({ email, password }) => {
    if (email && password) {
        // Логіка авторизації емейлу і пароля
        return { success: true };
    } else {
        return
    }
}

const loginWithGoogle = ({ googleToken }) => {
    if (googleToken) {
        // Логіка авторизації з гугл акаунта
        return { success: true };
    } else {
        return
    }
}

const loginWithApple = ({ appleToken }) => {
    if (appleToken) {
        // Логіка авторизації з епл акаунта
        return { success: true };
    } else {
        return
    }
}

module.exports = {
    loginWithEmailAndPassword,
    loginWithGoogle,
    loginWithApple,
};