// frontend/src/modules/admin/components/UserManagement/UserTable.jsx

import React from 'react';

const UserTable = ({ users, onEdit, onDelete }) => {
  const getRoleColor = (role) => {
    const colors = {
      admin: '#fff3e0',
      medico: '#e3f2fd',
      paciente: '#f3e5f5'
    };
    return colors[role] || '#f5f5f5';
  };

  const getRoleTextColor = (role) => {
    const colors = {
      admin: '#f57c00',
      medico: '#1976d2',
      paciente: '#7b1fa2'
    };
    return colors[role] || '#666';
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Administrador',
      medico: 'Médico',
      paciente: 'Paciente'
    };
    return roles[role] || role;
  };

  return (
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
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: getRoleColor(user.role),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: getRoleTextColor(user.role)
                    }}>
                      {user.nombre?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      background: getRoleColor(user.role),
                      color: getRoleTextColor(user.role)
                    }}
                  >
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.activo ? 'status-active' : 'status-inactive'}`}>
                    {user.activo ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-warning btn-small"
                      onClick={() => onEdit(user)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => onDelete(user.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;