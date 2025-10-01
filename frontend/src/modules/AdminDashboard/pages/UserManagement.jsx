import React, { useState, useEffect } from 'react';
import UserForm from '../components/UserForm'; // Importar el componente modal
import '../AdminDashboard.css';

const UserManagement = () => {
    // ... (Estados: users, loading, error, etc.)
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ... (USER_API_URL, fetchUsers, handleDeleteUser, etc. - El resto de la lógica de fetch es la misma)

    // Datos simulados (reemplaza con tu estado real de 'users')
    const simulatedUsers = [
        { id: 1, name: 'Juan Pérez', email: 'juan.perez@zm.com', role: 'medico', status: 'Activo' },
        { id: 2, name: 'Ana Torres', email: 'ana.torres@zm.com', role: 'paciente', status: 'Inactivo' },
        { id: 3, name: 'Dr. Carlos Rodríguez', email: 'carlos.r@zm.com', role: 'medico', status: 'Activo' },
        { id: 4, name: 'María González', email: 'maria.g@zm.com', role: 'paciente', status: 'Activo' },
    ];
    
    // Función para obtener la clase de color basada en el rol
    const getRoleBadgeStyle = (role) => {
        if (role === 'medico') return { background: '#e3f2fd', color: '#1976d2' };
        if (role === 'paciente') return { background: '#f3e5f5', color: '#7b1fa2' };
        return { background: '#eee', color: '#333' };
    };

    // ... (fetchUsers y handleDeleteUser se mantienen iguales)

    return (
        <div className="admin-page user-management">
            <div className="admin-card card-users">
                <div className="card-header">
                    <h3 className="card-title">👥 Gestionar Usuarios</h3>
                    <span className="card-icon">👥</span>
                </div>

                <div className="form-section">
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ width: '100%', marginBottom: '20px' }}>
                        ➕ Agregar Usuario
                    </button>

                    <div className="search-container">
                        <input type="text" id="searchUser" className="search-input" placeholder="Buscar usuario..." />
                        <button className="btn btn-secondary" onClick={() => alert("Función Buscar (API Call)")}>🔍 Buscar</button>
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mapear sobre el estado 'users' real */}
                                {simulatedUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>
                                            <span className="status-badge" style={getRoleBadgeStyle(user.role)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${user.status === 'Activo' ? 'active' : 'inactive'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-warning btn-small" onClick={() => alert(`Editar ${user.name}`)}>✏️ Editar</button>
                                            <button className="btn btn-danger btn-small" onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '5px' }}>🗑️ Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal de Usuario */}
            <UserForm 
                isVisible={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={(data) => console.log('Datos a enviar al backend:', data)}
            />
        </div>
    );
};

export default UserManagement;