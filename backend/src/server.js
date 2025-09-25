import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
const citasRoutes = require('./routes/citasRoutes');

// Rutas
app.use("/api/auth", authRoutes);
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