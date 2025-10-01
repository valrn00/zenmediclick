import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Rutas del paciente (ubicación real encontrada)
import PacienteRoutes from './zenmediclick-paciente/routes/PacienteRoutes';

// AdminRoutes: si existe en el proyecto puedes ajustar la ruta, sino puedes usar AdminDashboard directamente.
// import AdminRoutes from './modules/admin/routes/AdminRoutes';

// Páginas de auth (existen en src/pages/Auth)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PasswordRecovery from './pages/Auth/PasswordRecovery/PasswordReset';

// Componentes admin (opcional)
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import RoleRoute from './modules/admin/components/RoleRoute';

import './App.css';

// Nota: no se encontró un export claro de AuthProvider en el árbol. Si tienes uno en
// modules/auth/context/AuthContext.js(x) o similar, reemplaza la línea siguiente por el import real.
// import { AuthProvider } from './modules/auth/context/AuthContext';

const AuthProvider = ({ children }) => children; // placeholder si no existe un provider

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />

          {/* Rutas por módulo */}
          <Route path="/paciente/*" element={<PacienteRoutes />} />
          {/* Si tienes un AdminRoutes, sustitúyelo aquí */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
