import express from "express";
import cors from "cors"; // Use import instead of require
import { pool } from "./db.js";
import { PORT } from "./config.js";

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  const cities = await pool.query("SELECT * FROM railway.cities;");
  res.json(cities);
});

app.get("/cities", async (req, res) => {
  const [cities] = await pool.query("SELECT * FROM railway.cities;");
  res.json(cities);
});

app.get("/ping", async (req, res) => {
  const [result] = await pool.query('SELECT "HELLOR WORLD" as RESULT');
  res.json(result[0]);
});

app.get("/create", async (req, res) => {
  const result = await pool.query(
    'INSERT INTO cities(name) VALUES ("Santiago")'
  );
  res.json(result);
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
