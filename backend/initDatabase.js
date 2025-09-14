import db from "./database.js";

const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      cedula VARCHAR(20) PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol ENUM('paciente', 'medico', 'admin') DEFAULT 'paciente',
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS especialidades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS citas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      paciente_cedula VARCHAR(20),
      medico_cedula VARCHAR(20),
      especialidad_id INT,
      fecha DATETIME NOT NULL,
      motivo TEXT,
      estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
      diagnostico TEXT,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paciente_cedula) REFERENCES usuarios(cedula),
      FOREIGN KEY (medico_cedula) REFERENCES usuarios(cedula),
      FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
    )`,
    `CREATE TABLE IF NOT EXISTS recordatorios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      paciente_cedula VARCHAR(20),
      tipo ENUM('email', 'sms', '1_dia', '2_horas') NOT NULL,
      activo BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (paciente_cedula) REFERENCES usuarios(cedula)
    )`
  ];

  for (const query of queries) {
    await new Promise((resolve, reject) => {
      db.query(query, [], (err) => {
        if (err) {
          console.error("Error creando tabla:", err);
        }
        resolve();
      });
    });
  }
  console.log("Base de datos inicializada correctamente");
};

createTables();
