import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

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