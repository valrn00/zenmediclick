const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registroValidation, loginValidation, validarResultados } = require('../validators/auth.validator');

router.post('/registro', registroValidation, validarResultados, authController.registro);
router.post('/login', loginValidation, validarResultados, authController.login);

module.exports = router;