
import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // 👈 importante para leer JSON

// 🔹 Conexión a la base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // tu usuario MySQL
  password: "",     // tu contraseña si tienes
  database: "zenmediclick"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la BD:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor ZenMediClick corriendo!");
});

// 🔹 Agendar cita (POST)
app.post("/citas", (req, res) => {
  const { paciente, fecha, motivo } = req.body;

  if (!paciente || !fecha || !motivo) {
    return res.status(400).send("⚠️ Faltan datos obligatorios");
  }

  const sql = "INSERT INTO citas (paciente, fecha, motivo) VALUES (?, ?, ?)";
  db.query(sql, [paciente, fecha, motivo], (err) => {
    if (err) {
      console.error("❌ Error al agendar cita:", err);
      res.status(500).send("Error al agendar cita");
      return;
    }
    res.send("✅ Cita agendada correctamente");
  });
});

// 🔹 Listar citas (GET)
app.get("/citas", (req, res) => {
  db.query("SELECT * FROM citas", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener citas:", err);
      res.status(500).send("Error al obtener citas");
      return;
    }
    res.json(results);
  });
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
