import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🧍 USUARIOS
app.get("/usuarios", (_, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/usuarios", (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email)
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  db.query(
    "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
    [nombre, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre, email });
    }
  );
});

// 🌡️ SENSORES
app.get("/sensores", (_, res) => {
  db.query("SELECT * FROM sensores", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/sensores", (req, res) => {
  const { nombre_sensor, tipo_conexion, ubicacion } = req.body;
  db.query(
    "INSERT INTO sensores (nombre_sensor, tipo_conexion, ubicacion) VALUES (?, ?, ?)",
    [nombre_sensor, tipo_conexion, ubicacion],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre_sensor, tipo_conexion, ubicacion });
    }
  );
});

// 📈 LECTURAS
app.get("/lecturas", (_, res) => {
  db.query(
    `SELECT l.*, s.nombre_sensor 
     FROM lecturas l 
     JOIN sensores s ON l.id_sensor = s.id_sensor
     ORDER BY l.fecha_registro DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.post("/lecturas", (req, res) => {
  const { id_sensor, humedad, temperatura } = req.body;
  db.query(
    "INSERT INTO lecturas (id_sensor, humedad, temperatura) VALUES (?, ?, ?)",
    [id_sensor, humedad, temperatura],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, id_sensor, humedad, temperatura });
    }
  );
});

// 💧 CALENDARIO DE RIEGO
app.get("/calendario_riego", (_, res) => {
  db.query("SELECT * FROM calendario_riego", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/calendario_riego", (req, res) => {
  const { dia_semana, hora_riego, activo } = req.body;
  db.query(
    "INSERT INTO calendario_riego (dia_semana, hora_riego, activo) VALUES (?, ?, ?)",
    [dia_semana, hora_riego, activo ?? true],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, dia_semana, hora_riego, activo });
    }
  );
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌿 Servidor backend corriendo en puerto ${PORT}`);
});
