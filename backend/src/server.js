import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import medicosRoutes from "./routes/medicos.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
// Servir archivos estáticos de zenmediclick-medico/sistema-citas-medicas
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/medico', express.static(path.join(__dirname, '../../zenmediclick-medico/sistema-citas-medicas')));

// Rutas personalizadas para los HTML principales
app.get('/medico/agenda', (req, res) => {
  res.sendFile(path.join(__dirname, '../../zenmediclick-medico/sistema-citas-medicas/pages/agenda.html'));
});
app.get('/medico/detalles', (req, res) => {
  res.sendFile(path.join(__dirname, '../../zenmediclick-medico/sistema-citas-medicas/pages/detalles.html'));
});
app.get('/medico/observaciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../../zenmediclick-medico/sistema-citas-medicas/pages/observaciones.html'));
});
app.get('/medico', (req, res) => {
  res.sendFile(path.join(__dirname, '../../zenmediclick-medico/sistema-citas-medicas/index.html'));
});
const citasRoutes = require('./routes/citasRoutes');

// Rutas
app.use("/api/auth", authRoutes);
app.use('/api/medico', medicosRoutes);

app.use('/api', citasRoutes);

// Conexión DB y arranque servidor
const PORT = 4000;
(async () => {
  try {
    console.log("El nombre de la DB es:", process.env.DB_NAME); 
    await sequelize.authenticate();
    console.log("✅ Conectado a MySQL");
    await sequelize.sync(); // Crea tablas si no existen
    app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Error DB:", error);
  }
})();

app.use(cors({
    origin: 'http://localhost:3001' // O el puerto donde corre tu frontend
}));
const path = require('path');

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../Frontend')));

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/index.html'));
});
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Ajustar según tu puerto
    credentials: true
}));