const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const dateTimeRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const countryRegexp = /^[A-Z]{2}$/;
const locationRegexp = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ'’\s-]{2,50}$/;
const phoneRegexp = /^\+?\d{1,4}?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const passwordRegex = /^[a-zA-Z0-9]{8,24}$/;

module.exports = {
    emailRegexp,
    dateRegexp,
    dateTimeRegexp,
    countryRegexp,
    locationRegexp,
    phoneRegexp,
    passwordRegex,
};
