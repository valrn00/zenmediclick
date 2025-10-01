import React, { useState } from 'react';
import '../AdminDashboard.css';

// Este componente se usaría dentro de UserManagement.jsx como un modal
const UserForm = ({ isVisible, onClose, onSubmit, userData }) => {
    const [role, setRole] = useState(userData?.role || '');
    
    // Función de ejemplo para manejar el envío al backend (Create/Update)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Lógica de validación...
        
        // Simulación de envío a la API del backend
        const formData = {
            name: e.target.newUserName.value,
            email: e.target.newUserEmail.value,
            role: e.target.newUserRole.value,
            // ... otros campos
        };
        
        // Llama a la función que conecta con la DB (onSubmit en el padre)
        onSubmit(formData); 
        onClose();
    };

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
    };

    if (!isVisible) return null;

    return (
        <div className="modal-overlay"> {/* Añadir un overlay para el modal */}
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">➕ {userData ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Nombre Completo *</label>
                        <input type="text" id="newUserName" defaultValue={userData?.name} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" id="newUserEmail" defaultValue={userData?.email} required />
                        </div>
                        <div className="form-group">
                            <label>Teléfono *</label>
                            <input type="tel" id="newUserPhone" defaultValue={userData?.phone} required />
                        </div>
                        <div className="form-group">
                            <label>Rol *</label>
                            <select id="newUserRole" onChange={handleRoleChange} value={role} required>
                                <option value="">Seleccionar...</option>
                                <option value="paciente">Paciente</option>
                                <option value="medico">Médico</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <div id="doctorFields" style={{ display: role === 'medico' ? 'grid' : 'none' }}>
                        {/* Campos de Doctor aquí */}
                    </div>

                    <div className="form-group">
                        <label>Contraseña Temporal *</label>
                        <input type="password" id="newUserPassword" required={!userData} placeholder={userData ? 'Dejar vacío para no cambiar' : ''} />
                        <small style={{ color: '#666' }}>{userData ? 'Opcional, si desea cambiar la contraseña.' : 'El usuario deberá cambiar esta contraseña en su primer acceso.'}</small>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            💾 {userData ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                            ❌ Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;