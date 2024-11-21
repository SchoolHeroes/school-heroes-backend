const http = require('http');
const app = require('./app');

const { DB_HOST, PORT = 3000 } = process.env;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 
