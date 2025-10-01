import React, { useState, useEffect, useCallback } from 'react';

// 1. Datos de ejemplo migrados a un estado inicial
const citasIniciales = [
    {
        id: 1,
        fecha: '2025-04-15', // Cambiado el año para simular citas futuras
        hora: '10:00',
        especialidad: 'Cardiología',
        doctor: 'Dr. García López',
        estado: 'confirmada',
        motivo: 'Chequeo rutinario cardíaco'
    },
    {
        id: 2,
        fecha: '2025-04-22',
        hora: '14:30',
        especialidad: 'Dermatología',
        doctor: 'Dra. Martínez Silva',
        estado: 'pendiente',
        motivo: 'Revisión de lunares sospechosos'
    },
    {
        id: 3,
        fecha: '2025-05-05',
        hora: '09:15',
        especialidad: 'Medicina General',
        doctor: 'Dr. Rodríguez Peña',
        estado: 'confirmada',
        motivo: 'Control de presión arterial'
    }
];

// 2. Componente principal
const CancelarCitas = () => {
    // Hooks para gestionar el estado de las citas, el modal y la cita seleccionada
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);

    // --- Funciones Auxiliares (Migradas de JavaScript Vanilla) ---

    // Función para formatear la fecha
    const formatearFecha = (fecha) => {
        // Asegura que la fecha se interprete como local (ya que el input HTML es 'yyyy-mm-dd')
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para capitalizar el estado
    const capitalizar = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
    };
    
    // Función de carga de datos (simulando la llamada al backend)
    const cargarCitas = useCallback(() => {
        // ** Aquí iría tu lógica de fetch() para obtener datos del backend **
        // Por ahora, usamos los datos de ejemplo y filtramos:
        const citasFuturas = citasIniciales.filter(cita => {
            const fechaCita = new Date(cita.fecha + 'T' + cita.hora);
            const ahora = new Date();
            // Mostrar solo citas futuras que no estén ya canceladas
            return fechaCita > ahora && cita.estado !== 'cancelada';
        });

        setCitas(citasFuturas);
        setCargando(false);
    }, []);

    // 3. useEffect para cargar los datos al montar el componente
    useEffect(() => {
        cargarCitas();
    }, [cargarCitas]); // Dependencia del useCallback

    // --- Funciones para manejar la interacción ---

    const mostrarModalCancelacion = (citaId) => {
        const cita = citas.find(c => c.id === citaId);
        setCitaSeleccionada(cita);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setCitaSeleccionada(null);
    };

    const confirmarCancelacion = async () => {
        if (citaSeleccionada) {
            // ** 4. Lógica de integración con el Backend **
            try {
                // await fetch(`/backend/api/citas/${citaSeleccionada.id}/cancelar`, { method: 'POST' });
                console.log('Enviando cancelación al backend para la cita:', citaSeleccionada.id);

                // Si la cancelación en el backend es exitosa, actualizamos el estado:
                setCitas(citas.filter(c => c.id !== citaSeleccionada.id));
                alert('Cita cancelada exitosamente. Se ha enviado una notificación al centro médico.');
            } catch (error) {
                console.error("Error al cancelar la cita:", error);
                alert('Hubo un error al intentar cancelar la cita. Inténtalo de nuevo.');
            }
            // ----------------------------------------------------

            cerrarModal();
        }
    };

    // Si estás cargando, muestra un mensaje
    if (cargando) {
        return <div className="container">Cargando citas...</div>;
    }

    // --- 5. Estructura JSX (HTML migrado) ---
    return (
        // Los estilos en línea del <body> y otros se manejan externamente o aquí:
        <div className="main-layout" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            padding: '20px 0'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                
                {/* Header con botón de regreso */}
                <div className="page-header">
                    {/* El 'href' se reemplaza por un componente de React Router Link o una función de navegación */}
                    <a href="/index" className="back-button">← Regresar</a>
                    <h1>Cancelar Citas Programadas</h1>
                </div>

                {/* Contenedor de citas */}
                <div className="citas-container">
                    {citas.length === 0 ? (
                        /* Mensaje de citas vacías (si el array de citas está vacío) */
                        <div className="empty-message">
                            <div className="empty-icon">📅</div>
                            <h3>No tienes citas programadas</h3>
                            <p>Cuando tengas citas programadas, aparecerán aquí para que puedas cancelarlas si es necesario.</p>
                        </div>
                    ) : (
                        /* Mapeo de citas (Reemplazando el innerHTML y el loop) */
                        <div id="citasProgramadas">
                            {citas.map(cita => (
                                <div key={cita.id} className="cita-card">
                                    <div className="cita-header">
                                        <div className="cita-info">
                                            <div className="cita-fecha">{formatearFecha(cita.fecha)}</div>
                                            <div className="cita-hora">🕐 {cita.hora}</div>
                                            <span className={`estado-tag estado-${cita.estado}`}>
                                                {capitalizar(cita.estado)}
                                            </span>
                                        </div>
                                        {/* Botón con evento onClick de React */}
                                        <button 
                                            className="btn-cancel" 
                                            onClick={() => mostrarModalCancelacion(cita.id)}
                                        >
                                            🗑️ Cancelar Cita
                                        </button>
                                    </div>
                                    
                                    <div className="cita-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Especialidad</span>
                                            <span className="detail-value">{cita.especialidad}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Doctor</span>
                                            <span className="detail-value">{cita.doctor}</span>
                                        </div>
                                    </div>

                                    <div className="motivo-section">
                                        <div className="motivo-label">Motivo de la consulta:</div>
                                        <div>{cita.motivo}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación (Renderizado condicional) */}
            {modalAbierto && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-icon">⚠️</div>
                        <h3>¿Confirmar cancelación?</h3>
                        <p>¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.</p>
                        <div className="modal-buttons">
                            {/* Botones que llaman a las funciones del componente */}
                            <button className="btn-confirm" onClick={confirmarCancelacion}>
                                Sí, cancelar
                            </button>
                            <button className="btn-cancel-modal" onClick={cerrarModal}>
                                No, mantener
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CancelarCitas;