const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const locationRegexp = /^[A-Z][a-z]+$/;
const phoneRegexp = /^(\+38)?0\d{9}$/;
const passwordRegex = /^[a-zA-Z0-9]{8,24}$/;

module.exports = {
    emailRegexp,
    dateRegexp,
    locationRegexp,
    phoneRegexp,
    passwordRegex,
};