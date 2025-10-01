import React, { useState, useEffect, useCallback } from 'react';

// Datos de ejemplo
const recordatoriosIniciales = [
    {
        id: 1,
        tipo: 'cita',
        descripcion: 'Cita con cardiólogo Dr. García',
        fecha: '2025-10-15', // Usar año futuro para simulación
        hora: '09:30',
        frecuencia: 'una_vez',
        notificaciones: ['app', 'email'],
        anticipacion: 60,
        activo: true
    },
    {
        id: 2,
        tipo: 'medicamento',
        descripcion: 'Tomar aspirina para prevención',
        fecha: new Date().toISOString().split('T')[0], // Hoy
        hora: '08:00',
        frecuencia: 'diario',
        notificaciones: ['app', 'sms'],
        anticipacion: 0,
        activo: true
    },
    {
        id: 3,
        tipo: 'ejercicio',
        descripcion: 'Rutina de ejercicios cardiovasculares',
        fecha: '2025-10-20',
        hora: '17:00',
        frecuencia: 'diario',
        notificaciones: ['app'],
        anticipacion: 15,
        activo: false
    }
];

// --- Funciones Auxiliares (Migradas de JavaScript Vanilla) ---

const getTipoIcon = (tipo) => {
    const iconos = {
        'cita': '📅',
        'medicamento': '💊',
        'ejercicio': '🏃‍♂️',
        'dieta': '🥗',
        'chequeo': '🩺',
        'personalizado': '⭐'
    };
    return iconos[tipo] || '📝';
};

const getTipoNombre = (tipo) => {
    const nombres = {
        'cita': 'Cita Médica',
        'medicamento': 'Medicamento',
        'ejercicio': 'Ejercicio',
        'dieta': 'Dieta',
        'chequeo': 'Chequeo',
        'personalizado': 'Personalizado'
    };
    return nombres[tipo] || tipo;
};

const getFrecuenciaNombre = (frecuencia) => {
    const nombres = {
        'una_vez': 'Una sola vez',
        'diario': 'Diario',
        'semanal': 'Semanal',
        'mensual': 'Mensual'
    };
    return nombres[frecuencia] || frecuencia;
};

const getAnticipacionTexto = (minutos) => {
    if (minutos === 0) return 'En el momento';
    if (minutos < 60) return `${minutos} minutos antes`;
    if (minutos === 60) return '1 hora antes';
    if (minutos === 1440) return '1 día antes';
    return `${minutos} minutos antes`;
};

const formatearFecha = (fecha) => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES');
};

// Valor inicial para el formulario
const formInicial = {
    tipoRecordatorio: '',
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0], // Hoy por defecto
    hora: '',
    frecuencia: '',
    notificaciones: ['app'],
    anticipacion: '0',
};

// 2. Componente principal
const Recordatorios = () => {
    const [recordatorios, setRecordatorios] = useState(recordatoriosIniciales);
    const [formData, setFormData] = useState(formInicial);

    // useEffect para asegurar que la fecha mínima del input sea hoy
    useEffect(() => {
        // En React, esta validación se hace a nivel de JSX, pero la podemos asegurar aquí
        // para que el estado inicial de fechaInicio sea correcto.
        // const hoy = new Date().toISOString().split('T')[0];
        // setFormData(prev => ({ ...prev, fechaInicio: prev.fechaInicio || hoy }));
    }, []);

    // --- Handlers de Interacción ---

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => {
                const newNotifs = checked
                    ? [...prev.notificaciones, value]
                    : prev.notificaciones.filter(n => n !== value);
                return { ...prev, notificaciones: newNotifs };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación simple (podría ser más robusta)
        if (!formData.tipoRecordatorio || !formData.descripcion || !formData.fechaInicio || !formData.hora || !formData.frecuencia || formData.notificaciones.length === 0) {
            alert('Por favor, completa todos los campos requeridos y selecciona al menos un método de notificación.');
            return;
        }

        const nuevoRecordatorio = {
            id: Date.now(), // Usar timestamp como ID temporal
            ...formData,
            anticipacion: parseInt(formData.anticipacion),
            activo: true,
        };

        // 3. Actualizar el estado (simulando guardar en el backend y refrescar)
        setRecordatorios(prev => [...prev, nuevoRecordatorio]);
        setFormData(formInicial); // Limpiar formulario
        
        alert('¡Recordatorio creado exitosamente!');
    };

    const toggleRecordatorio = (id) => {
        // 4. Inmutabilidad: Clonar el array y modificar el elemento
        setRecordatorios(prev => prev.map(r => 
            r.id === id ? { ...r, activo: !r.activo } : r
        ));
        // Aquí iría el llamado al backend para guardar el cambio
        const estado = recordatorios.find(r => r.id === id).activo ? 'desactivado' : 'activado';
        alert(`Recordatorio ${estado} correctamente.`);
    };

    const eliminarRecordatorio = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este recordatorio?')) {
            // 4. Inmutabilidad: Filtrar el elemento
            setRecordatorios(prev => prev.filter(r => r.id !== id));
            // Aquí iría el llamado al backend para eliminar
            alert('Recordatorio eliminado correctamente.');
        }
    };

    // 5. Componente para renderizar un recordatorio individual
    const RecordatorioItem = ({ recordatorio }) => (
        <div className={`recordatorio-item ${recordatorio.activo ? 'activo' : 'inactivo'}`}>
            <div className="recordatorio-header">
                <span className="recordatorio-tipo">{getTipoIcon(recordatorio.tipo)} {getTipoNombre(recordatorio.tipo)}</span>
                <span className={`recordatorio-estado estado-${recordatorio.activo ? 'activo' : 'inactivo'}`}>
                    {recordatorio.activo ? 'Activo' : 'Inactivo'}
                </span>
            </div>
            <div className="recordatorio-detalles">
                <strong>Descripción:</strong> {recordatorio.descripcion}<br/>
                <strong>Horario:</strong> {formatearFecha(recordatorio.fecha)} a las {recordatorio.hora}<br/>
                <strong>Frecuencia:</strong> {getFrecuenciaNombre(recordatorio.frecuencia)}<br/>
                <strong>Notificaciones:</strong> {recordatorio.notificaciones.join(', ')}<br/>
                <strong>Anticipación:</strong> {getAnticipacionTexto(recordatorio.anticipacion)}
            </div>
            <div className="recordatorio-acciones">
                <button className="btn-toggle" onClick={() => toggleRecordatorio(recordatorio.id)}>
                    {recordatorio.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button className="btn-delete" onClick={() => eliminarRecordatorio(recordatorio.id)}>
                    Eliminar
                </button>
            </div>
        </div>
    );

    const listaVacia = recordatorios.length === 0;

    // --- 6. Estructura JSX ---
    return (
        <div className="main-layout-recordatorios">
            <div className="container">
                {/* Header con botón de regreso */}
                <div className="page-header">
                    <a href="/index" className="back-button">← Regresar</a>
                    <h1>Configurar Recordatorios</h1>
                </div>

                <div className="recordatorios-grid">
                    {/* Tarjeta de Formulario (Nuevo Recordatorio) */}
                    <div className="recordatorio-card">
                        <div className="card-header">
                            <span className="card-icon">⏰</span>
                            <h2 className="card-title">Nuevo Recordatorio</h2>
                        </div>

                        {/* Formulario migrado a React: onSubmit y onChange */}
                        <form onSubmit={handleSubmit}>
                            
                            <div className="form-group">
                                <label htmlFor="tipoRecordatorio">Tipo de Recordatorio:</label>
                                <select id="tipoRecordatorio" name="tipoRecordatorio" value={formData.tipoRecordatorio} onChange={handleInputChange} required>
                                    <option value="">Seleccionar tipo</option>
                                    <option value="cita">Recordatorio de Cita</option>
                                    <option value="medicamento">Tomar Medicamento</option>
                                    <option value="ejercicio">Rutina de Ejercicio</option>
                                    <option value="dieta">Seguimiento de Dieta</option>
                                    <option value="chequeo">Chequeo de Salud</option>
                                    <option value="personalizado">Personalizado</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción:</label>
                                <textarea id="descripcion" name="descripcion" rows="3" 
                                          placeholder="Describe lo que quieres recordar..." 
                                          value={formData.descripcion} onChange={handleInputChange} required></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                                <input type="date" id="fechaInicio" name="fechaInicio" 
                                       value={formData.fechaInicio} onChange={handleInputChange} 
                                       min={new Date().toISOString().split('T')[0]} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hora">Hora:</label>
                                <input type="time" id="hora" name="hora" 
                                       value={formData.hora} onChange={handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label>Frecuencia:</label>
                                <select id="frecuencia" name="frecuencia" value={formData.frecuencia} onChange={handleInputChange} required>
                                    <option value="">Seleccionar frecuencia</option>
                                    <option value="una_vez">Una sola vez</option>
                                    <option value="diario">Diario</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensual">Mensual</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Métodos de Notificación:</label>
                                <div className="checkbox-group">
                                    <div className="checkbox-item">
                                        <input type="checkbox" id="notifEmail" name="notificaciones" value="email"
                                               checked={formData.notificaciones.includes('email')} onChange={handleInputChange} />
                                        <label htmlFor="notifEmail">Email</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input type="checkbox" id="notifSMS" name="notificaciones" value="sms"
                                               checked={formData.notificaciones.includes('sms')} onChange={handleInputChange} />
                                        <label htmlFor="notifSMS">SMS</label>
                                    </div>
                                    <div className="checkbox-item">
                                        <input type="checkbox" id="notifApp" name="notificaciones" value="app"
                                               checked={formData.notificaciones.includes('app')} onChange={handleInputChange} />
                                        <label htmlFor="notifApp">Notificación en App</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="anticipacion">Tiempo de Anticipación:</label>
                                <select id="anticipacion" name="anticipacion" value={formData.anticipacion} onChange={handleInputChange}>
                                    <option value="0">En el momento</option>
                                    <option value="15">15 minutos antes</option>
                                    <option value="30">30 minutos antes</option>
                                    <option value="60">1 hora antes</option>
                                    <option value="1440">1 día antes</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary">➕ Crear Recordatorio</button>
                        </form>
                    </div>

                    {/* Tarjeta de Lista de Recordatorios */}
                    <div className="recordatorio-card">
                        <div className="card-header">
                            <span className="card-icon">🔔</span>
                            <h2 className="card-title">Mis Recordatorios</h2>
                        </div>

                        <div id="listaRecordatorios">
                            {listaVacia ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🔕</div>
                                    <h4>No tienes recordatorios configurados</h4>
                                    <p>Crea tu primer recordatorio usando el formulario de la izquierda.</p>
                                </div>
                            ) : (
                                recordatorios.map(r => <RecordatorioItem key={r.id} recordatorio={r} />)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recordatorios;