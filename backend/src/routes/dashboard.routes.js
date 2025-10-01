const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Requiere autenticación y rol admin
router.use(authMiddleware);
router.use((req, res, next) => {
  console.log('Middleware ejecutado');
  authMiddleware(req, res, next);
}, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
});

router.get('/stats', dashboardController.getStats);

module.exports = router;
