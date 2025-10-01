import React, { useEffect, useState } from 'react';
import UserTable from './UserTable';
import UserModal from './UserModal';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simular fetch inicial — reemplaza por llamada real a la API
    const mock = [
      { id: 1, nombre: 'Ana Pérez', email: 'ana@ejemplo.com', role: 'admin', activo: true },
      { id: 2, nombre: 'Dr. Luis Gómez', email: 'luis@ejemplo.com', role: 'medico', activo: true },
      { id: 3, nombre: 'María López', email: 'maria@ejemplo.com', role: 'paciente', activo: false }
    ];
    setTimeout(() => {
      setUsers(mock);
      setLoading(false);
    }, 300);
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar usuario?')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleSave = (formData) => {
    if (selectedUser) {
      // actualizar
      setUsers(prev => prev.map(u => (u.id === selectedUser.id ? { ...u, ...formData } : u)));
    } else {
      // crear
      const newUser = { id: Date.now(), ...formData, activo: true };
      setUsers(prev => [newUser, ...prev]);
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestión de usuarios</h2>
        <div>
          <button className="btn btn-primary" onClick={() => { setSelectedUser(null); setShowModal(true); }}>
            ➕ Nuevo usuario
          </button>
        </div>
      </div>

      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />

      {showModal && (
        <UserModal
          user={selectedUser}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setSelectedUser(null); }}
        />
      )}
    </div>
  );
};

export default UserManagement;