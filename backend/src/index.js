import express from "express";
import dotenv from "dotenv";
dotenv.config(); 
import connection from "./db/db.js"; // Importa la conexión

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(connection.threadId); // Ejemplo de cómo usarla
});