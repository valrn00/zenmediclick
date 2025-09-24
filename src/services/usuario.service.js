const Usuario = require('../models/usuario.model');

class UsuarioService {
  async obtenerTodosLosUsuarios() {
    try {
      const usuarios = await Usuario.find({}, { password: 0 }); // Excluir password
      return usuarios;
    } catch (error) {
      throw error;
    }
  }

  async obtenerUsuarioPorId(id) {
    try {
      const usuario = await Usuario.findById(id, { password: 0 });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async actualizarUsuario(id, userData) {
    try {
      const usuario = await Usuario.findByIdAndUpdate(
        id, 
        userData, 
        { new: true, select: { password: 0 } }
      );
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      return usuario;
    } catch (error) {
      throw error;
    }
  }

  async eliminarUsuario(id) {
    try {
      const usuario = await Usuario.findByIdAndDelete(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UsuarioService();