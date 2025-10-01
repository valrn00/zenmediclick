import React from 'react';
import '../AdminDashboard.css';

const Header = ({ adminEmail, adminName }) => {
    // Usar props para datos dinámicos, aunque aquí se usan valores fijos del HTML
    const name = adminName || "Admin Principal";
    const email = adminEmail || "admin@zenmediclick.com";
    
    return (
        <div className="admin-header">
            <div className="admin-title">
                <span style={{ fontSize: '3rem' }}>⚙️</span>
                <div>
                    <h1>Panel de Administración</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Gestión completa del sistema ZenMediClick</p>
                </div>
            </div>
            <div className="admin-info">
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{name}</div>
                <div style={{ fontSize: '14px' }}>{email}</div>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>🔒 Sesión segura activa</div>
            </div>
        </div>
    );
};

export default Header;