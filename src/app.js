import express from "express";
import cors from "cors"; // Use import instead of require
import { pool } from "./db.js";
import { API_KEY, PORT } from "./config.js";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  const cities = await pool.query("SELECT * FROM railway.cities;");
  res.json(cities);
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
