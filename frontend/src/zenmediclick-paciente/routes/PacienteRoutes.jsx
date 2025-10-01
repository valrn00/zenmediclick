// src/modules/paciente/routes/PacienteRoutes.jsx
import { Routes, Route } from "react-router-dom";
import IndexPaciente from "../pages/Index";
import AgendarCita from "../pages/AgendarCita";
import HistorialCitas from "../pages/HistorialCitas";
import CancelarCita from "../pages/CancelarCita";
import Recordatorios from "../pages/Recordatorios";

export default function PacienteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPaciente />} />
      <Route path="agendar" element={<AgendarCita />} />
      <Route path="historial" element={<HistorialCitas />} />
      <Route path="cancelar" element={<CancelarCita />} />
      <Route path="recordatorios" element={<Recordatorios />} />
    </Routes>
  );
}
