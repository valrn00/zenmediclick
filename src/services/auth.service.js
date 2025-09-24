const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

class AuthService {
  async registrarUsuario(userData) {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ email: userData.email });
      if (usuarioExistente) {
        throw new Error('El usuario ya existe');
      }

      // Hashear la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Crear nuevo usuario
      const nuevoUsuario = new Usuario({
        ...userData,
        password: hashedPassword
      });

      await nuevoUsuario.save();
      return nuevoUsuario;
    } catch (error) {
      throw error;
    }
  }

  async loginUsuario(email, password) {
    try {
      // Buscar usuario
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, usuario.password);
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token
      const token = jwt.sign(
        { id: usuario._id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { usuario, token };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();