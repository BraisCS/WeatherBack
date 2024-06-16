require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Configurar la conexión a la base de datos
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Rutas para obtener datos
app.get("/cities", (req, res) => {
  pool.query("SELECT * FROM cities", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/temperatures/:cityId", (req, res) => {
  const { cityId } = req.params;
  pool.query(
    "SELECT * FROM temperature_data WHERE city_id = ?",
    [cityId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(results);
      }
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
