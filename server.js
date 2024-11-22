require("dotenv").config();
const http = require("http");
const app = require("./app");
const { sql } = require("./db"); 

(async () => {
  try {
    await sql`SELECT 1`;
    console.log("Database connected successfully");

    const { PORT = 3000 } = process.env;
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); 
  }
})();