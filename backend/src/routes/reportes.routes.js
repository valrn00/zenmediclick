const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación y rol admin
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
});

// Rutas de reportes
router.get('/dashboard-stats', reportesController.getDashboardStats);
router.get('/citas', reportesController.getReporteCitas);
router.get('/usuarios', reportesController.getReporteUsuarios);
router.get('/medicos', reportesController.getReporteMedicos);

module.exports = router;