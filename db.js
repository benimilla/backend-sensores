import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./orquideas.db", // se guarda en la raíz del proyecto
  driver: sqlite3.Database
});

// ✅ Crear tablas si no existen
await db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS sensores (
  id_sensor INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_sensor TEXT,
  tipo_conexion TEXT,
  ubicacion TEXT
);

CREATE TABLE IF NOT EXISTS lecturas (
  id_lectura INTEGER PRIMARY KEY AUTOINCREMENT,
  id_sensor INTEGER,
  humedad REAL,
  temperatura REAL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calendario_riego (
  id_riego INTEGER PRIMARY KEY AUTOINCREMENT,
  dia_semana TEXT,
  hora_riego TEXT,
  activo INTEGER DEFAULT 1
);
`);

console.log("✅ Base de datos SQLite lista");
