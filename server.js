import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// 🧍 USUARIOS
// -----------------------------------------------------------------------------

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await db.all("SELECT * FROM usuarios");
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
      [nombre, email]
    );
    res.json({ id: result.lastID, nombre, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 🌡️ SENSORES
// -----------------------------------------------------------------------------

app.get("/sensores", async (req, res) => {
  try {
    const sensores = await db.all("SELECT * FROM sensores");
    res.json(sensores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sensores", async (req, res) => {
  const { nombre_sensor, tipo_conexion, ubicacion } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO sensores (nombre_sensor, tipo_conexion, ubicacion) VALUES (?, ?, ?)",
      [nombre_sensor, tipo_conexion, ubicacion]
    );
    res.json({ id: result.lastID, nombre_sensor, tipo_conexion, ubicacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 📈 LECTURAS
// -----------------------------------------------------------------------------

app.get("/lecturas", async (req, res) => {
  try {
    const lecturas = await db.all(`
      SELECT l.*, s.nombre_sensor 
      FROM lecturas l
      LEFT JOIN sensores s ON l.id_sensor = s.id_sensor
      ORDER BY l.fecha_registro DESC
    `);
    res.json(lecturas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/lecturas", async (req, res) => {
  const { id_sensor, humedad, temperatura } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO lecturas (id_sensor, humedad, temperatura) VALUES (?, ?, ?)",
      [id_sensor, humedad, temperatura]
    );
    res.json({ id: result.lastID, id_sensor, humedad, temperatura });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 💧 CALENDARIO DE RIEGO
// -----------------------------------------------------------------------------

app.get("/calendario_riego", async (req, res) => {
  try {
    const calendario = await db.all("SELECT * FROM calendario_riego");
    res.json(calendario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/calendario_riego", async (req, res) => {
  const { dia_semana, hora_riego, activo } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO calendario_riego (dia_semana, hora_riego, activo) VALUES (?, ?, ?)",
      [dia_semana, hora_riego, activo ?? 1]
    );
    res.json({ id: result.lastID, dia_semana, hora_riego, activo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 🚀 Servidor
// -----------------------------------------------------------------------------

app.listen(3001, () => {
  console.log("🌿 Servidor backend corriendo en puerto 3001 con SQLite");
});
