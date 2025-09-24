const { body, param, validationResult } = require('express-validator');

const actualizarUsuarioValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('telefono')
    .optional()
    .matches(/^[0-9\-\+\s\(\)]+$/)
    .withMessage('Formato de teléfono inválido'),
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de usuario inválido'),
];

const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  actualizarUsuarioValidation,
  idValidation,
  validarResultados
};