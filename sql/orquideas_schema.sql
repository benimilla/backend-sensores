CREATE DATABASE IF NOT EXISTS orquideas_db;
USE orquideas_db;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE sensores (
  id_sensor INT AUTO_INCREMENT PRIMARY KEY,
  nombre_sensor VARCHAR(100),
  tipo_conexion ENUM('WiFi','Bluetooth'),
  ubicacion VARCHAR(100)
);

CREATE TABLE lecturas (
  id_lectura INT AUTO_INCREMENT PRIMARY KEY,
  id_sensor INT,
  humedad DECIMAL(5,2),
  temperatura DECIMAL(5,2),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_sensor) REFERENCES sensores(id_sensor)
);

CREATE TABLE calendario_riego (
  id_riego INT AUTO_INCREMENT PRIMARY KEY,
  dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'),
  hora_riego TIME,
  activo BOOLEAN DEFAULT TRUE
);
