import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// ✅ SERVIDOR INICIADO
// -----------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌿 Servidor backend corriendo en puerto ${PORT} con SQLite`);
});

// -----------------------------------------------------------------------------
// 🧩 FUNCIONES AUXILIARES
// -----------------------------------------------------------------------------
const handleError = (res, err, message = "Error interno del servidor") => {
  console.error("❌", err.message);
  res.status(500).json({ error: message, detalle: err.message });
};

// -----------------------------------------------------------------------------
// 🧍 USUARIOS
// -----------------------------------------------------------------------------
app.get("/usuarios", async (_, res) => {
  try {
    const usuarios = await db.all("SELECT * FROM usuarios");
    res.json(usuarios);
  } catch (err) {
    handleError(res, err, "No se pudieron obtener los usuarios");
  }
});

app.post("/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email)
    return res.status(400).json({ error: "Nombre y email son requeridos" });

  try {
    const result = await db.run(
      "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
      [nombre, email]
    );
    res.status(201).json({ id: result.lastID, nombre, email });
  } catch (err) {
    handleError(res, err, "No se pudo crear el usuario");
  }
});

// -----------------------------------------------------------------------------
// 🌡️ SENSORES
// -----------------------------------------------------------------------------
app.get("/sensores", async (_, res) => {
  try {
    const sensores = await db.all("SELECT * FROM sensores");
    res.json(sensores);
  } catch (err) {
    handleError(res, err, "No se pudieron obtener los sensores");
  }
});

app.post("/sensores", async (req, res) => {
  const { nombre_sensor, tipo_conexion, ubicacion } = req.body;
  if (!nombre_sensor)
    return res.status(400).json({ error: "El nombre del sensor es requerido" });

  try {
    const result = await db.run(
      "INSERT INTO sensores (nombre_sensor, tipo_conexion, ubicacion) VALUES (?, ?, ?)",
      [nombre_sensor, tipo_conexion ?? "WiFi", ubicacion ?? "Invernadero"]
    );
    res.status(201).json({
      id: result.lastID,
      nombre_sensor,
      tipo_conexion,
      ubicacion,
    });
  } catch (err) {
    handleError(res, err, "No se pudo registrar el sensor");
  }
});

// -----------------------------------------------------------------------------
// 📈 LECTURAS
// -----------------------------------------------------------------------------
app.get("/lecturas", async (_, res) => {
  try {
    const lecturas = await db.all(`
      SELECT l.*, s.nombre_sensor 
      FROM lecturas l
      LEFT JOIN sensores s ON l.id_sensor = s.id_sensor
      ORDER BY l.fecha_registro DESC
    `);
    res.json(lecturas);
  } catch (err) {
    handleError(res, err, "No se pudieron obtener las lecturas");
  }
});

app.post("/lecturas", async (req, res) => {
  const { id_sensor, humedad, temperatura } = req.body;
  if (!id_sensor || humedad == null || temperatura == null)
    return res
      .status(400)
      .json({ error: "id_sensor, humedad y temperatura son requeridos" });

  try {
    const result = await db.run(
      "INSERT INTO lecturas (id_sensor, humedad, temperatura) VALUES (?, ?, ?)",
      [id_sensor, humedad, temperatura]
    );
    res.status(201).json({ id: result.lastID, id_sensor, humedad, temperatura });
  } catch (err) {
    handleError(res, err, "No se pudo registrar la lectura");
  }
});

// -----------------------------------------------------------------------------
// 💧 CALENDARIO DE RIEGO
// -----------------------------------------------------------------------------
app.get("/calendario_riego", async (_, res) => {
  try {
    const calendario = await db.all("SELECT * FROM calendario_riego");
    res.json(calendario);
  } catch (err) {
    handleError(res, err, "No se pudo obtener el calendario de riego");
  }
});

app.post("/calendario_riego", async (req, res) => {
  const { dia_semana, hora_riego, activo } = req.body;
  if (!dia_semana || !hora_riego)
    return res
      .status(400)
      .json({ error: "Día de la semana y hora de riego son requeridos" });

  try {
    const result = await db.run(
      "INSERT INTO calendario_riego (dia_semana, hora_riego, activo) VALUES (?, ?, ?)",
      [dia_semana, hora_riego, activo ?? 1]
    );
    res.status(201).json({ id: result.lastID, dia_semana, hora_riego, activo });
  } catch (err) {
    handleError(res, err, "No se pudo registrar el calendario de riego");
  }
});

// -----------------------------------------------------------------------------
// 🧪 RUTA DE CHEQUEO
// -----------------------------------------------------------------------------
app.get("/check", (_, res) => {
  res.json({
    status: "OK",
    mensaje: "Servidor y base de datos activos ✅",
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
//  SIMULACIÓN DE DATOS AUTOMÁTICOS
// -----------------------------------------------------------------------------
setInterval(async () => {
  try {
    const sensores = await db.all("SELECT * FROM sensores");
    let idSensor;

    // Si no hay sensores, crear uno
    if (sensores.length === 0) {
      const result = await db.run(
        "INSERT INTO sensores (nombre_sensor, tipo_conexion, ubicacion) VALUES (?, ?, ?)",
        ["Sensor Orquídeas 1", "WiFi", "Invernadero Principal"]
      );
      idSensor = result.lastID;
      console.log("🌱 Sensor de simulación creado automáticamente");
    } else {
      idSensor = sensores[0].id_sensor;
    }

    // Generar datos aleatorios
    const humedad = (70 + Math.random() * 20).toFixed(2); // 70–90%
    const temperatura = (18 + Math.random() * 6).toFixed(2); // 18–24°C

    await db.run(
      "INSERT INTO lecturas (id_sensor, humedad, temperatura) VALUES (?, ?, ?)",
      [idSensor, humedad, temperatura]
    );

    console.log(`📊 Nueva lectura: ${humedad}% humedad | ${temperatura}°C`);
  } catch (err) {
    console.error("⚠️ Error en simulación:", err.message);
  }
}, 5000);
//hola