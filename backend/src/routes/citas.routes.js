const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas para admin
router.get('/', citasController.getAll); // Ver todas las citas
router.post('/', citasController.create); // Crear cita
router.put('/:id', citasController.update); // Actualizar cita
router.delete('/:id', citasController.delete); // Eliminar cita

module.exports = router;

