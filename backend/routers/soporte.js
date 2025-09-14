
import express from "express";
import Soporte from "../models/soporte.js";

const router = express.Router();

// Crear ticket de soporte
router.post("/crear-ticket", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const { asunto, mensaje } = req.body;
        if (!asunto || !mensaje) {
            return res.json({ success: false, message: "Asunto y mensaje son requeridos" });
        }
        if (mensaje.trim().length < 10) {
            return res.json({ success: false, message: "El mensaje debe tener al menos 10 caracteres" });
        }
        const nuevoTicket = await Soporte.crear({
            usuario_cedula: req.session.user_cedula,
            asunto,
            mensaje
        });
        if (nuevoTicket) {
            return res.json({ success: true, message: "Ticket de soporte creado exitosamente", ticket_id: nuevoTicket.id });
        } else {
            return res.json({ success: false, message: "Error al crear ticket" });
        }
    } catch (e) {
        console.error("Error creando ticket:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Obtener tickets del usuario
router.get("/mis-tickets", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const tickets = await Soporte.obtenerPorUsuario(req.session.user_cedula);
        const tickets_json = tickets.map(ticket => ticket.toDict());
        return res.json({ success: true, tickets: tickets_json });
    } catch (e) {
        console.error("Error obteniendo tickets:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Obtener ticket por id
router.get("/ticket/:ticket_id", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const ticket_id = req.params.ticket_id;
        const ticket = await Soporte.obtenerPorId(ticket_id);
        if (!ticket) {
            return res.json({ success: false, message: "Ticket no encontrado" });
        }
        if (ticket.usuario_cedula !== req.session.user_cedula) {
            return res.json({ success: false, message: "No tienes permisos para ver este ticket" });
        }
        return res.json({ success: true, ticket: ticket.toDict() });
    } catch (e) {
        console.error("Error obteniendo ticket:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Actualizar estado de ticket
router.post("/actualizar-estado", async (req, res) => {
    try {
        if (!req.session.user_cedula) {
            return res.json({ success: false, message: "No autorizado" });
        }
        const { ticket_id, estado } = req.body;
        const estados_validos = ["abierto", "en_proceso", "cerrado", "cancelado"];
        if (!ticket_id || !estado) {
            return res.json({ success: false, message: "ID de ticket y estado son requeridos" });
        }
        if (!estados_validos.includes(estado)) {
            return res.json({ success: false, message: "Estado no válido" });
        }
        const ticket = await Soporte.obtenerPorId(ticket_id);
        if (!ticket) {
            return res.json({ success: false, message: "Ticket no encontrado" });
        }
        if (ticket.usuario_cedula !== req.session.user_cedula) {
            return res.json({ success: false, message: "No tienes permisos para modificar este ticket" });
        }
        if (await ticket.actualizarEstado(estado)) {
            return res.json({ success: true, message: "Estado actualizado exitosamente" });
        } else {
            return res.json({ success: false, message: "Error al actualizar estado" });
        }
    } catch (e) {
        console.error("Error actualizando estado:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

