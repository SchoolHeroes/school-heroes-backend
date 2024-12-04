const convertToDateTime = (dateString) => {
  const [day, month, year] = dateString.split('-');

  const date = new Date(year, month - 1, day);

  return date.toISOString();
}

module.exports = convertToDateTime;