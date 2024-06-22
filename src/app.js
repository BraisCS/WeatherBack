import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { API_KEY, PORT } from "./config.js";
import axios from "axios";

const app = express();
app.use(cors("*")); // Permitir solicitudes desde http://localhost:4200

app.get("/", async (req, res) => {
  try {
    const [cities] = await pool.query("SELECT * FROM railway.cities;");
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Error al obtener las ciudades" });
  }
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
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Error al obtener datos meteorológicos" });
  }
});

app.post("/create", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO railway.cities (name) VALUES (?)",
      [name]
    );
    res.json({ message: `Ciudad ${name} creada`, id: result.insertId });
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ error: "Error al crear la ciudad" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM railway.cities WHERE id = ?", [id]);
    res.json({ message: `Ciudad con id ${id} eliminada` });
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).json({ error: "Error al eliminar la ciudad" });
  }
});

// Asegúrate de que esta ruta esté presente
app.get("/cities", async (req, res) => {
  try {
    const [cities] = await pool.query("SELECT * FROM railway.cities;");
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Error al obtener las ciudades" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
