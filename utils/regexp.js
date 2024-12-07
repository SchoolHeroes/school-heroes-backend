const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const countryRegexp = /^[A-Z]{2}$/;
const locationRegexp = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ'’\s-]{2,50}$/;
const phoneRegexp = /^\+?\d{1,4}?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const passwordRegex = /^[a-zA-Z0-9]{8,24}$/;

module.exports = {
    emailRegexp,
    dateRegexp,
    countryRegexp,
    locationRegexp,
    phoneRegexp,
    passwordRegex,
};
