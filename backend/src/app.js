import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";

const app = express();
const reportesRoutes = require('./routes/reportes.routes');
const citasRoutes = require('./routes/citas.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use('/api/admin/reportes', reportesRoutes);
app.use('/api/admin/citas', citasRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

export default app;

