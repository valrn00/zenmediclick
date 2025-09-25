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

// Rutas
app.use("/api/auth", authRoutes);
app.use('/api/medico', medicosRoutes);


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