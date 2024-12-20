const axios = require('axios');

const intervalTask = () => {
  setInterval(async () => {
  try {
    const response = await axios.get('https://school-heroes-backend.onrender.com/api/auth/interval');
      console.log('Server response:', response.data.message);
    } catch (error) {
      console.error('Error sending request:', error.message);
    }
  }, 15 * 60 * 1000); 
}

module.exports = intervalTask;