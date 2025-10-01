import React, { useState, useEffect, useMemo } from 'react';

const Observaciones = () => {
  const [observaciones, setObservaciones] = useState([
    {
      id: 1,
      paciente: 'Nicolás Sánchez',
      fecha: '2024-09-22',
      hora: '8:30 AM',
      tipo: 'seguimiento',
      observacion: 'Paciente presenta mejoría significativa en dolor abdominal. Presión arterial estable en 120/80. Se recomienda continuar con tratamiento actual y control en 2 semanas.',
      estado: 'activa'
    },
    {
      id: 2,
      paciente: 'Andrea Rodríguez',
      fecha: '2024-09-22',
      hora: '9:15 AM',
      tipo: 'primera-vez',
      observacion: 'Primera consulta por síntomas de hipertensión. Antecedentes familiares positivos. Se solicita perfil lipídico, glucemia y electrocardiograma. Iniciar con cambios en estilo de vida.',
      estado: 'activa'
    },
    {
      id: 3,
      paciente: 'Carlos Mendoza',
      fecha: '2024-09-21',
      hora: '2:30 PM',
      tipo: 'control',
      observacion: 'Control de diabetes tipo 2. HbA1c en 6.8%, excelente control glucémico. Paciente muy comprometido con dieta y ejercicio. Continuar con metformina.',
      estado: 'activa'
    },
    {
      id: 4,
      paciente: 'María González',
      fecha: '2024-09-20',
      hora: '11:00 AM',
      tipo: 'seguimiento',
      observacion: 'Seguimiento por gastritis. Paciente refiere mejoría del 80% en síntomas después del tratamiento con omeprazol. Continuar tratamiento por 2 semanas más.',
      estado: 'activa'
    },
    {
      id: 5,
      paciente: 'Luis Herrera',
      fecha: '2024-09-19',
      hora: '11:30 AM',
      tipo: 'urgente',
      observacion: 'Paciente consulta por dolor torácico de 2 horas de evolución. ECG normal, troponinas negativas. Dolor de origen muscular. Se indica analgésicos y reposo. Control en 24 horas.',
      estado: 'activa'
    },
    {
      id: 6,
      paciente: 'Ana Martínez',
      fecha: '2024-09-18',
      hora: '3:00 PM',
      tipo: 'control',
      observacion: 'Control post-operatorio. Herida quirúrgica en buen estado, sin signos de infección. Retirar puntos en próxima cita. Paciente evoluciona favorablemente.',
      estado: 'archivada'
    }
  ]);
  const [observacionesFiltradas, setObservacionesFiltradas] = useState([...observaciones]);
  const [showForm, setShowForm] = useState(false);
  const [editandoObservacion, setEditandoObservacion] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    observationType: '',
    observationContent: '',
    observationDate: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      console.log('Auto-guardado realizado...');
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  useEffect(() => {
    if (showForm) {
      if (editandoObservacion) {
        setFormData({
          patientName: editandoObservacion.paciente,
          observationType: editandoObservacion.tipo,
          observationContent: editandoObservacion.observacion,
          observationDate: editandoObservacion.fecha
        });
      } else {
        setFormData({
          patientName: '',
          observationType: '',
          observationContent: '',
          observationDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [showForm, editandoObservacion]);

  // Observaciones se renderizan ahora usando JSX en el return del componente.

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const mostrarFormulario = () => {
    setShowForm(true);
  };

  const ocultarFormulario = () => {
    setShowForm(false);
    setEditandoObservacion(null);
  };

  const filtrarPorTipo = (tipo) => {
    setActiveFilter(tipo);
    // filtrado reactivo manejado por useEffect que depende de activeFilter
  };

  const buscarObservaciones = () => {
    // filtrado reactivo manejado por useEffect que depende de searchTerm
  };

  const editarObservacion = (id) => {
    const obs = observaciones.find(o => o.id === id);
    if (obs) {
      setEditandoObservacion(obs);
      setShowForm(true);
    }
  };

  const eliminarObservacion = (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta observación?')) {
      setObservaciones(prev => prev.filter(obs => obs.id !== id));
      alert('Observación eliminada exitosamente');
    }
  };

  const imprimirObservacion = (id) => {
    const obs = observaciones.find(o => o.id === id);
    if (obs) {
      alert(`Imprimiendo observación de ${obs.paciente}...`);
      setTimeout(() => alert('Observación enviada a la impresora!'), 1500);
    }
  };

  // estadísticas calculadas con useMemo (no se necesita función separada)

  // Recalcula las observaciones filtradas cuando cambian los datos, el término de búsqueda o el filtro activo
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = [...observaciones];
    if (activeFilter) filtered = filtered.filter(o => o.tipo === activeFilter);
    if (term) filtered = filtered.filter(o =>
      o.paciente.toLowerCase().includes(term) ||
      o.observacion.toLowerCase().includes(term)
    );
    setObservacionesFiltradas(filtered);
  }, [observaciones, searchTerm, activeFilter]);

  const exportarObservaciones = () => {
    alert('Generando reporte de observaciones...');
    setTimeout(() => alert('Reporte exportado exitosamente en formato PDF!'), 2000);
  };

  const configurarNotificaciones = () => {
    const configuraciones = `
Configuración de Notificaciones:

🔔 Recordatorios automáticos: Activado
📱 SMS a pacientes: Activado  
📧 Email de seguimiento: Activado
⏰ Notificaciones urgentes: Inmediatas
📊 Reporte semanal: Lunes 9:00 AM

¿Desea modificar alguna configuración?
    `.trim();
    alert(configuraciones);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaObservacion = {
      paciente: formData.patientName,
      tipo: formData.observationType,
      observacion: formData.observationContent,
      fecha: formData.observationDate,
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }),
      estado: 'activa'
    };
    if (editandoObservacion) {
      setObservaciones(prev => prev.map(obs => obs.id === editandoObservacion.id ? { ...nuevaObservacion, id: editandoObservacion.id } : obs));
      alert('Observación actualizada exitosamente');
    } else {
      nuevaObservacion.id = Date.now();
      setObservaciones(prev => [nuevaObservacion, ...prev]);
      alert('Observación guardada exitosamente');
    }
    // observacionesFiltradas será recalculado por el efecto
    setShowForm(false);
    setEditandoObservacion(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      setShowForm(true);
    }
    if (e.key === 'Escape') {
      setShowForm(false);
      setEditandoObservacion(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-sans" onKeyDown={handleKeyDown}>
      <header className="flex justify-between items-center p-5 md:p-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-4 text-2xl font-bold">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] rounded-full flex items-center justify-center text-xl">🏥</div>
          <span>ZenMediClick</span>
        </div>
        <div className="flex gap-4">
          <a href="index.html" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Inicio</a>
          <a href="agenda.html" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Agenda</a>
          <a href="detalles.html" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Detalles</a>
          <a href="observaciones.html" className="px-5 py-2 bg-white/40 rounded-full text-white hover:bg-white/50 hover:-translate-y-0.5 transition-all">Observaciones</a>
        </div>
      </header>

      <main className="p-10 max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-light text-center mb-8 text-shadow-md">Observaciones Médicas</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Estadísticas calculadas de forma declarativa */}
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1">{useMemo(() => observaciones.length, [observaciones])}</div>
            <div className="stat-label text-xs text-gray-600 uppercase">Total</div>
          </div>
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1">{useMemo(() => observaciones.filter(o => o.fecha === new Date().toISOString().split('T')[0]).length, [observaciones])}</div>
            <div className="stat-label text-xs text-gray-600 uppercase">Hoy</div>
          </div>
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1">{useMemo(() => observaciones.filter(o => o.tipo === 'urgente').length, [observaciones])}</div>
            <div className="stat-label text-xs text-gray-600 uppercase">Urgentes</div>
          </div>
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1">{useMemo(() => observaciones.filter(o => o.tipo === 'seguimiento').length, [observaciones])}</div>
            <div className="stat-label text-xs text-gray-600 uppercase">Seguimiento</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-white/95 text-gray-800 p-8 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
              <h2 className="text-2xl font-semibold">Registro de Observaciones</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-teal-400 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={mostrarFormulario}>
                <span>➕</span> Nueva Observación
              </button>
            </div>
            <div className="relative mb-6">
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-200 rounded-full pr-10"
                placeholder="Buscar por paciente o contenido..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); buscarObservaciones(); }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">🔍</span>
            </div>
            <div className="flex flex-wrap gap-2.5 mb-5">
              <button className={`px-4 py-2 rounded-full ${activeFilter === '' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-800'} hover:-translate-y-0.5 transition-all`} onClick={() => filtrarPorTipo('')}>
                Todas
              </button>
              <button className={`px-4 py-2 rounded-full ${activeFilter === 'seguimiento' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-800'} hover:-translate-y-0.5 transition-all`} onClick={() => filtrarPorTipo('seguimiento')}>
                Seguimiento
              </button>
              <button className={`px-4 py-2 rounded-full ${activeFilter === 'primera-vez' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-800'} hover:-translate-y-0.5 transition-all`} onClick={() => filtrarPorTipo('primera-vez')}>
                Primera Vez
              </button>
              <button className={`px-4 py-2 rounded-full ${activeFilter === 'urgente' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-800'} hover:-translate-y-0.5 transition-all`} onClick={() => filtrarPorTipo('urgente')}>
                Urgente
              </button>
              <button className={`px-4 py-2 rounded-full ${activeFilter === 'control' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-200 text-gray-800'} hover:-translate-y-0.5 transition-all`} onClick={() => filtrarPorTipo('control')}>
                Control
              </button>
            </div>
            <div>
              {observacionesFiltradas.length === 0 ? (
                <div className="text-center p-16 text-gray-600">
                  <div className="text-6xl mb-5 opacity-50">📝</div>
                  <p>No se encontraron observaciones</p>
                </div>
              ) : (
                observacionesFiltradas.map(obs => (
                  <div key={obs.id} className="observation-card bg-gradient-to-br from-[#f8f9ff] to-white border border-gray-200 rounded-xl p-6 mb-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-[#667eea]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-lg font-semibold text-gray-800">{obs.paciente}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">📅 {formatearFecha(obs.fecha)} - {obs.hora}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${obs.tipo === 'seguimiento' ? 'bg-blue-100 text-blue-800' : obs.tipo === 'primera-vez' ? 'bg-green-100 text-green-800' : obs.tipo === 'urgente' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {obs.tipo.replace('-', ' ')}
                      </div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#667eea] mb-4">{obs.observacion}</div>
                    <div className="flex gap-2.5">
                      <button className="action-btn bg-blue-500 text-white px-3 py-1.5 rounded-md hover:-translate-y-0.5 hover:shadow-md transition-all" onClick={() => editarObservacion(obs.id)}>✏️ Editar</button>
                      <button className="action-btn bg-gray-500 text-white px-3 py-1.5 rounded-md hover:-translate-y-0.5 hover:shadow-md transition-all" onClick={() => imprimirObservacion(obs.id)}>🖨️ Imprimir</button>
                      <button className="action-btn bg-red-500 text-white px-3 py-1.5 rounded-md hover:-translate-y-0.5 hover:shadow-md transition-all" onClick={() => eliminarObservacion(obs.id)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {showForm ? (
            <div className="bg-white/95 text-gray-800 p-8 rounded-xl shadow-md sticky top-5">
              <h3 className="text-2xl font-semibold text-center mb-6">{editandoObservacion ? 'Editar Observación' : 'Nueva Observación'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block font-semibold mb-2 text-gray-600">Paciente</label>
                  <input
                    type="text"
                    id="patientName"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#667eea] focus:shadow-outline transition-all"
                    placeholder="Nombre del paciente"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block font-semibold mb-2 text-gray-600">Tipo de Observación</label>
                  <select
                    id="observationType"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#667eea] focus:shadow-outline transition-all"
                    value={formData.observationType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="seguimiento">Seguimiento</option>
                    <option value="primera-vez">Primera Vez</option>
                    <option value="urgente">Urgente</option>
                    <option value="control">Control</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block font-semibold mb-2 text-gray-600">Observación Médica</label>
                  <textarea
                    id="observationContent"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg min-h-[120px] resize-y focus:border-[#667eea] focus:shadow-outline transition-all"
                    placeholder="Descripción detallada de la observación médica..."
                    value={formData.observationContent}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-5">
                  <label className="block font-semibold mb-2 text-gray-600">Fecha</label>
                  <input
                    type="date"
                    id="observationDate"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#667eea] focus:shadow-outline transition-all"
                    value={formData.observationDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="w-full p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  Guardar Observación
                </button>
                <button type="button" className="w-full p-3 bg-gray-500 text-white rounded-lg mt-2 hover:bg-gray-600 transition-all" onClick={ocultarFormulario}>
                  Cancelar
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/95 text-gray-800 p-8 rounded-xl shadow-md sticky top-5">
              <h3 className="text-2xl font-semibold text-center mb-6">Panel de Control</h3>
              <div className="text-center p-5">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-600 mb-6">Gestiona las observaciones médicas de tus pacientes</p>
                <div className="flex flex-col gap-4">
                  <button className="p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={mostrarFormulario}>
                    ➕ Nueva Observación
                  </button>
                  <button className="p-4 bg-cyan-600 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={exportarObservaciones}>
                    📊 Exportar Reporte
                  </button>
                  <button className="p-4 bg-green-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={configurarNotificaciones}>
                    🔔 Configurar Notificaciones
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Observaciones;