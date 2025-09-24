const AuthService = require('../services/auth.service');

class AuthController {
  async registro(req, res) {
    try {
      const usuario = await AuthService.registrarUsuario(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado correctamente',
        data: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { usuario, token } = await AuthService.loginUsuario(email, password);
      
      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
          },
          token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();