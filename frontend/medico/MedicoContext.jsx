import React, { createContext, useContext, useEffect, useState } from 'react';
import MedicoAPI from './js/MedicoAPI.js'; // Importar la clase MedicoAPI

const MedicoContext = createContext();

export const MedicoProvider = ({ children }) => {
  const api = new MedicoAPI();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [medico, setMedico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Verificar autenticación al cargar el contexto
  useEffect(() => {
    const verificarAuth = () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setMessage({ text: 'Sesión expirada. Redirigiendo al login...', type: 'error' });
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    };

    if (verificarAuth()) {
      // Simular carga de datos del médico (puedes usar api.getDashboard si tienes un endpoint)
      setMedico({ nombre: 'Usuario' }); // Reemplazar con llamada real a api.getDashboard
      setLoading(false);
    }
  }, []);

  // Mostrar mensajes (adaptado de showMessage)
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Formatear fecha (de MedicoSystem)
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Funciones de MedicoSystem adaptadas
  const cargarAgenda = async (fecha) => {
    try {
      const result = await api.obtenerAgenda({ fecha });
      if (result.success) {
        showMessage('Agenda cargada exitosamente', 'success');
        return result.data;
      } else {
        showMessage('Error al cargar agenda: ' + result.message, 'error');
        return [];
      }
    } catch (error) {
      showMessage('Error de conexión al cargar agenda', 'error');
      return [];
    }
  };

  const cancelarCita = async (id, fecha) => {
    if (window.confirm('¿Está seguro de cancelar esta cita?')) {
      try {
        const result = await api.actualizarEstadoCita(id, { estado: 'cancelada' });
        if (result.success) {
          showMessage('Cita cancelada exitosamente', 'success');
          return true;
        } else {
          showMessage('Error al cancelar cita: ' + result.message, 'error');
          return false;
        }
      } catch (error) {
        showMessage('Error de conexión', 'error');
        return false;
      }
    }
    return false;
  };

  const contextValue = {
    api,
    isAuthenticated,
    medico,
    loading,
    message,
    showMessage,
    formatearFecha,
    cargarAgenda,
    cancelarCita,
  };

  return (
    <MedicoContext.Provider value={contextValue}>
      {children}
      {message && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background:
              message.type === 'success'
                ? '#4CAF50'
                : message.type === 'error'
                ? '#F44336'
                : message.type === 'warning'
                ? '#FF9800'
                : '#2196F3',
            color: 'white',
            borderRadius: '8px',
            zIndex: 10000,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: '350px',
          }}
        >
          {message.type === 'success' && '✅ '}
          {message.type === 'error' && '❌ '}
          {message.type === 'warning' && '⚠️ '}
          {message.type === 'info' && 'ℹ️ '}
          {message.text}
        </div>
      )}
    </MedicoContext.Provider>
  );
};

export const useMedico = () => useContext(MedicoContext);