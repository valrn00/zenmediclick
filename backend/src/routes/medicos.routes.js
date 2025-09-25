import { Router } from 'express';
import MedicoController from '../controllers/medicoController.js';
const router = Router();

// Rutas de agenda
router.get('/agenda', MedicoController.obtenerAgenda);
router.put('/citas/:id/estado', MedicoController.actualizarEstadoCita);
router.put('/citas/:id/reagendar', MedicoController.reagendarCita);

// Rutas de historial detallado
router.get('/historial-detallado', MedicoController.obtenerHistorialDetallado);

// Rutas de observaciones
router.get('/observaciones', MedicoController.obtenerObservaciones);
router.post('/observaciones', MedicoController.crearObservacion);
router.put('/observaciones/:id', MedicoController.actualizarObservacion);
router.delete('/observaciones/:id', MedicoController.eliminarObservacion);

// Rutas de reportes
router.get('/reporte-diario', MedicoController.generarReporteDiario);

export default router;