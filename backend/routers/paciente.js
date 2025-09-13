
import express from "express";
import Cita from "../models/cita.js";
import Usuario from "../models/usuario.js";

const router = express.Router();

// Agendar cita
router.post("/agendar-cita", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const { especialidad, medico, fecha, motivo } = req.body;
        const nuevaCita = await Cita.crear({
            paciente_cedula: req.session.user_cedula,
            medico_cedula: medico,
            especialidad_id: especialidad,
            fecha,
            motivo
        });
        if (nuevaCita) {
            return res.json({ success: true, message: "Cita agendada exitosamente", cita_id: nuevaCita.id });
        } else {
            return res.json({ success: false, message: "Error al agendar cita" });
        }
    } catch (e) {
        console.error("Error agendando cita:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Cancelar cita
router.post("/cancelar-cita", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const { cita_id } = req.body;
        const cita = await Cita.obtenerPorId(cita_id);
        if (!cita || cita.paciente_cedula !== req.session.user_cedula) {
            return res.json({ success: false, message: "Cita no encontrada o no autorizada" });
        }
        if (await cita.cancelar()) {
            return res.json({ success: true, message: "Cita cancelada exitosamente" });
        } else {
            return res.json({ success: false, message: "Error al cancelar cita" });
        }
    } catch (e) {
        console.error("Error cancelando cita:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Historial de citas
router.get("/historial-citas", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const citas = await Cita.obtenerPorPaciente(req.session.user_cedula);
        const citas_json = citas.map(cita => ({
            id: cita.id,
            fecha: cita.fecha,
            motivo: cita.motivo,
            estado: cita.estado,
            diagnostico: cita.diagnostico || "-",
            medico_nombre: cita.medico_nombre,
            especialidad_nombre: cita.especialidad_nombre
        }));
        return res.json({ success: true, citas: citas_json });
    } catch (e) {
        console.error("Error obteniendo historial:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Obtener médicos por especialidad
router.get("/medicos/:especialidad", async (req, res) => {
    try {
        const especialidad = req.params.especialidad;
        const medicos = await Usuario.obtenerMedicosPorEspecialidad(especialidad);
        const medicos_json = medicos.map(m => ({ cedula: m.cedula, nombre: m.nombre }));
        return res.json({ success: true, medicos: medicos_json });
    } catch (e) {
        console.error("Error obteniendo médicos:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

export default router;