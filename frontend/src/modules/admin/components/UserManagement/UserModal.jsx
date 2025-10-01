// frontend/src/modules/admin/components/UserManagement/UserModal.jsx

import React, { useState, useEffect } from 'react';

const UserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    role: '',
    password: '',
    especialidad: '',
    licencia: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        role: user.role || '',
        password: '',
        especialidad: user.especialidad || '',
        licencia: user.licencia || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.email || !formData.role) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!user && !formData.password) {
      alert('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    if (formData.role === 'medico' && !formData.especialidad) {
      alert('Por favor selecciona una especialidad para el médico');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {user ? '✏️ Editar Usuario' : '➕ Agregar Nuevo Usuario'}
          </h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Rol *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="paciente">Paciente</option>
                <option value="medico">Médico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          {formData.role === 'medico' && (
            <div id="doctorFields">
              <div className="form-group">
                <label>Especialidad</label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar especialidad...</option>
                  <option value="cardiologia">Cardiología</option>
                  <option value="pediatria">Pediatría</option>
                  <option value="neurologia">Neurología</option>
                  <option value="ginecologia">Ginecología</option>
                  <option value="traumatologia">Traumatología</option>
                  <option value="dermatologia">Dermatología</option>
                </select>
              </div>

              <div className="form-group">
                <label>Número de Licencia Médica</label>
                <input
                  type="text"
                  name="licencia"
                  value={formData.licencia}
                  onChange={handleChange}
                  placeholder="Ej: MP-12345"
                />
              </div>
            </div>
          )}

          {!user && (
            <div className="form-group">
              <label>Contraseña Temporal *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <small style={{ color: '#666' }}>
                El usuario deberá cambiar esta contraseña en su primer acceso
              </small>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              💾 {user ? 'Actualizar' : 'Crear'} Usuario
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;