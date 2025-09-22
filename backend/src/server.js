import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { login } from "./controllers/auth.controller.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.post("/login", login);

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
