require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const express = require("express");

const sql = neon(process.env.DATABASE_URL);

const dbRouter = express.Router();

dbRouter.get("/db-version", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).send(`Database version: ${version}`);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Database connection error");
  }
});

module.exports = { sql, dbRouter };
