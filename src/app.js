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

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: `${city},es`,
          appid: API_KEY,
          units: "metric",
          lang: "es",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos meteorológicos" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
