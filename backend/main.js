import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import authRouter from "./routers/auth.js";
import pacienteRouter from "./routers/paciente.js";
import soporteRouter from "./routers/soporte.js";
// import { createTables } from "./initDatabase.js"; // Descomenta si quieres inicializar la BD

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(session({
  secret: "tu_clave_secreta_muy_segura_aqui",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rutas API
app.use("/api/auth", authRouter);
app.use("/api/paciente", pacienteRouter);
app.use("/api/soporte", soporteRouter);

// Servir archivos estáticos del frontend
const frontendPath = path.resolve("../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/:filename", (req, res) => {
  res.sendFile(path.join(frontendPath, req.params.filename));
});

app.get("/paciente/:filename", (req, res) => {
  res.sendFile(path.join(frontendPath, "paciente", req.params.filename));
});

// Inicializar base de datos (opcional)
// createTables();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
