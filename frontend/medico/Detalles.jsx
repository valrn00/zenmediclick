import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Detalles = () => {
  const citasHistoricas = [
    {
      id: 1,
      fecha: '2024-09-22',
      hora: '8:00 AM',
      paciente: 'Nicolás Sánchez',
      telefono: '300-123-4567',
      email: 'nicolas.sanchez@email.com',
      motivo: 'Control rutinario',
      estado: 'confirmada',
      diagnostico: 'Hipertensión arterial controlada',
      tratamiento: 'Continuar con medicación actual',
      proximaCita: '2024-10-22',
      observaciones: 'Paciente presenta buena evolución. Presión arterial dentro de rangos normales.'
    },
    {
      id: 2,
      fecha: '2024-09-22',
      hora: '9:00 AM',
      paciente: 'Andrea Rodríguez',
      telefono: '301-234-5678',
      email: 'andrea.rodriguez@email.com',
      motivo: 'Primera consulta',
      estado: 'pendiente',
      diagnostico: 'Evaluación inicial pendiente',
      tratamiento: 'Por definir según exámenes',
      proximaCita: 'Por agendar',
      observaciones: 'Primera consulta. Solicitar exámenes de laboratorio completos.'
    },
    {
      id: 3,
      fecha: '2024-09-21',
      hora: '2:00 PM',
      paciente: 'Carlos Mendoza',
      telefono: '302-345-6789',
      email: 'carlos.mendoza@email.com',
      motivo: 'Seguimiento diabetes',
      estado: 'completada',
      diagnostico: 'Diabetes tipo 2 controlada',
      tratamiento: 'Metformina 850mg cada 12 horas',
      proximaCita: '2024-10-21',
      observaciones: 'Excelente control glucémico. Paciente muy comprometido con el tratamiento.'
    },
    {
      id: 4,
      fecha: '2024-09-20',
      hora: '10:30 AM',
      paciente: 'María González',
      telefono: '303-456-7890',
      email: 'maria.gonzalez@email.com',
      motivo: 'Dolor abdominal',
      estado: 'completada',
      diagnostico: 'Gastritis leve',
      tratamiento: 'Omeprazol 20mg en ayunas',
      proximaCita: '2024-10-05',
      observaciones: 'Mejoría significativa. Continuar con tratamiento y dieta.'
    },
    {
      id: 5,
      fecha: '2024-09-19',
      hora: '11:00 AM',
      paciente: 'Luis Herrera',
      telefono: '304-567-8901',
      email: 'luis.herrera@email.com',
      motivo: 'Chequeo general',
      estado: 'cancelada',
      diagnostico: 'N/A',
      tratamiento: 'N/A',
      proximaCita: 'Reagendar',
      observaciones: 'Cita cancelada por el paciente. Motivo: viaje de trabajo.'
    }
  ];

  const [citasFiltradas, setCitasFiltradas] = useState([...citasHistoricas]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [filters, setFilters] = useState({
    fechaDesde: '',
    fechaHasta: '',
    buscarPaciente: '',
    filtroEstado: ''
  });

  useEffect(() => {
    const hoy = new Date();
    const hace30dias = new Date();
    hace30dias.setDate(hace30dias.getDate() - 30);
    setFilters(prev => ({
      ...prev,
      fechaDesde: hace30dias.toISOString().split('T')[0],
      fechaHasta: hoy.toISOString().split('T')[0]
    }));
    cargarCitas();
    actualizarEstadisticas();
  }, []);

  const cargarCitas = () => {
    const container = document.getElementById('listaCitas');
    if (citasFiltradas.length === 0) {
      container.innerHTML = `
        <div class="text-center p-16 text-gray-600">
          <div class="text-6xl mb-5 opacity-50">🔍</div>
          <p>No se encontraron citas con los filtros aplicados</p>
        </div>
      `;
      return;
    }
    container.innerHTML = '';
    citasFiltradas.forEach(cita => {
      const citaCard = document.createElement('div');
      citaCard.className = 'cita-card bg-gradient-to-br from-[#f8f9ff] to-white border border-gray-200 rounded-xl p-6 mb-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#667eea]';
      citaCard.onclick = () => seleccionarCita(cita);
      citaCard.innerHTML = `
        <div class="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase bg-${cita.estado === 'confirmada' ? 'green-100 text-green-800' : cita.estado === 'pendiente' ? 'yellow-100 text-yellow-800' : cita.estado === 'completada' ? 'blue-100 text-blue-800' : 'red-100 text-red-800'}">${cita.estado.toUpperCase()}</div>
        <div class="flex justify-between items-center mb-4">
          <div class="text-lg font-bold text-[#667eea]">${formatearFecha(cita.fecha)}</div>
          <div class="text-base bg-gray-100 px-3 py-1 rounded-full">${cita.hora}</div>
        </div>
        <div class="text-xl font-semibold mb-2">${cita.paciente}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div class="text-xs font-semibold text-gray-600 uppercase">Motivo</div>
            <div class="text-base">${cita.motivo}</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-600 uppercase">Teléfono</div>
            <div class="text-base">${cita.telefono}</div>
          </div>
        </div>
      `;
      container.appendChild(citaCard);
    });
  };

  const seleccionarCita = (cita) => {
    document.querySelectorAll('.cita-card').forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    setCitaSeleccionada(cita);
  };

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const aplicarFiltros = () => {
    setCitasFiltradas(citasHistoricas.filter(cita => {
      let cumpleFiltros = true;
      if (filters.fechaDesde && cita.fecha < filters.fechaDesde) cumpleFiltros = false;
      if (filters.fechaHasta && cita.fecha > filters.fechaHasta) cumpleFiltros = false;
      if (filters.buscarPaciente && !cita.paciente.toLowerCase().includes(filters.buscarPaciente.toLowerCase())) cumpleFiltros = false;
      if (filters.filtroEstado && cita.estado !== filters.filtroEstado) cumpleFiltros = false;
      return cumpleFiltros;
    }));
    actualizarEstadisticas();
  };

  const actualizarEstadisticas = () => {
    const total = citasFiltradas.length;
    const completadas = citasFiltradas.filter(c => c.estado === 'completada').length;
    const pendientes = citasFiltradas.filter(c => c.estado === 'pendiente').length;
    const canceladas = citasFiltradas.filter(c => c.estado === 'cancelada').length;
    document.getElementById('totalCitas').textContent = total;
    document.getElementById('citasCompletadas').textContent = completadas;
    document.getElementById('citasPendientes').textContent = pendientes;
    document.getElementById('citasCanceladas').textContent = canceladas;
  };

  const imprimirHistorial = (citaId) => {
    const cita = citasHistoricas.find(c => c.id === citaId);
    alert(`Imprimiendo historial médico de ${cita.paciente}...`);
    setTimeout(() => alert('Historial enviado a la impresora exitosamente!'), 1500);
  };

  const exportarPDF = (citaId) => {
    const cita = citasHistoricas.find(c => c.id === citaId);
    alert(`Generando PDF del historial de ${cita.paciente}...`);
    setTimeout(() => alert('PDF generado y descargado exitosamente!'), 2000);
  };

  const confirmarCita = (citaId) => {
    setCitasFiltradas(citasFiltradas.map(c => c.id === citaId ? { ...c, estado: 'confirmada' } : c));
    alert(`Cita confirmada para ${citasFiltradas.find(c => c.id === citaId).paciente}`);
    setCitaSeleccionada(prev => ({ ...prev, estado: 'confirmada' }));
  };

  const reagendarCita = (citaId) => {
    const nuevaFecha = prompt('Ingrese la nueva fecha (YYYY-MM-DD):');
    const nuevaHora = prompt('Ingrese la nueva hora (HH:MM AM/PM):');
    if (nuevaFecha && nuevaHora) {
      setCitasFiltradas(citasFiltradas.map(c => c.id === citaId ? { ...c, fecha: nuevaFecha, hora: nuevaHora, estado: 'confirmada' } : c));
      alert(`Cita reagendada para ${citasFiltradas.find(c => c.id === citaId).paciente} - ${nuevaFecha} a las ${nuevaHora}`);
      setCitaSeleccionada(prev => ({ ...prev, fecha: nuevaFecha, hora: nuevaHora, estado: 'confirmada' }));
    }
  };

  const cancelarCita = (citaId) => {
    if (window.confirm('¿Está seguro que desea cancelar esta cita?')) {
      setCitasFiltradas(citasFiltradas.map(c => c.id === citaId ? { ...c, estado: 'cancelada', observaciones: c.observaciones + '\n\nCita cancelada el ' + new Date().toLocaleDateString() } : c));
      alert(`Cita cancelada para ${citasFiltradas.find(c => c.id === citaId).paciente}`);
      setCitaSeleccionada(prev => ({ ...prev, estado: 'cancelada', observaciones: prev.observaciones + '\n\nCita cancelada el ' + new Date().toLocaleDateString() }));
    }
  };

  const marcarCompletada = (citaId) => {
    setCitasFiltradas(citasFiltradas.map(c => c.id === citaId ? { ...c, estado: 'completada' } : c));
    alert(`Cita marcada como completada para ${citasFiltradas.find(c => c.id === citaId).paciente}`);
    setCitaSeleccionada(prev => ({ ...prev, estado: 'completada' }));
  };

  const agregarObservaciones = (citaId) => {
    const cita = citasFiltradas.find(c => c.id === citaId);
    const nuevasObservaciones = prompt('Ingrese las nuevas observaciones:', cita.observaciones);
    if (nuevasObservaciones !== null) {
      setCitasFiltradas(citasFiltradas.map(c => c.id === citaId ? { ...c, observaciones: nuevasObservaciones } : c));
      setCitaSeleccionada(prev => ({ ...prev, observaciones: nuevasObservaciones }));
      alert('Observaciones actualizadas exitosamente');
    }
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
    if (id === 'buscarPaciente') aplicarFiltros();
  };

  const limpiarFiltros = () => {
    setFilters({
      fechaDesde: '',
      fechaHasta: '',
      buscarPaciente: '',
      filtroEstado: ''
    });
    setCitasFiltradas([...citasHistoricas]);
    actualizarEstadisticas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-sans">
      <header className="flex justify-between items-center p-5 md:p-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-4 text-2xl font-bold">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] rounded-full flex items-center justify-center text-xl">🏥</div>
          <span>ZenMediClick</span>
        </div>
        <div className="flex gap-4">
          <a href="index.html" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Inicio</a>
          <a href="agenda.html" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Agenda</a>
          <a href="detalles.html" className="px-5 py-2 bg-white/40 rounded-full text-white hover:bg-white/50 hover:-translate-y-0.5 transition-all">Detalles</a>
          <a href="observaciones.html" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Observaciones</a>
        </div>
      </header>

      <main className="p-10 max-w-[1400px] mx-auto">
        <h1 className="text-4xl font-light text-center mb-8 text-shadow-md">Historial Detallado de Citas</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1" id="totalCitas">24</div>
            <div className="stat-label text-sm text-gray-600">Total Citas</div>
          </div>
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1" id="citasCompletadas">18</div>
            <div className="stat-label text-sm text-gray-600">Completadas</div>
          </div>
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1" id="citasPendientes">3</div>
            <div className="stat-label text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-white/95 text-gray-800 p-5 rounded-xl shadow-md text-center">
            <div className="stat-number text-3xl font-bold text-[#667eea] mb-1" id="citasCanceladas">3</div>
            <div className="stat-label text-sm text-gray-600">Canceladas</div>
          </div>
        </div>

        <div className="bg-white/95 text-gray-800 p-6 rounded-xl shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">
            <div>
              <label className="block font-semibold text-gray-800">Fecha Desde</label>
              <input type="date" id="fechaDesde" className="w-full p-3 border-2 border-gray-200 rounded-lg" value={filters.fechaDesde} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="block font-semibold text-gray-800">Fecha Hasta</label>
              <input type="date" id="fechaHasta" className="w-full p-3 border-2 border-gray-200 rounded-lg" value={filters.fechaHasta} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="block font-semibold text-gray-800">Paciente</label>
              <input type="text" id="buscarPaciente" className="w-full p-3 border-2 border-gray-200 rounded-lg" placeholder="Nombre del paciente" value={filters.buscarPaciente} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="block font-semibold text-gray-800">Estado</label>
              <select id="filtroEstado" className="w-full p-3 border-2 border-gray-200 rounded-lg" value={filters.filtroEstado} onChange={handleFilterChange}>
                <option value="">Todos los estados</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <button className="w-full p-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={aplicarFiltros}>
                Filtrar
              </button>
              <button className="w-full p-3 bg-gray-500 text-white rounded-lg mt-2 hover:bg-gray-600 transition-all" onClick={limpiarFiltros}>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="bg-white/95 text-gray-800 p-8 rounded-xl shadow-md">
            <div id="listaCitas"></div>
          </div>
          <div className="bg-white/95 text-gray-800 p-8 rounded-xl shadow-md sticky top-5">
            <div className="text-2xl font-semibold mb-5 border-b-2 border-[#667eea] pb-2">Detalles de la Cita</div>
            {citaSeleccionada ? (
              <>
                <div className="mb-6">
                  <div className="text-base font-semibold text-[#667eea] mb-2">Información del Paciente</div>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#667eea]">
                    <strong>Nombre:</strong> {citaSeleccionada.paciente}<br />
                    <strong>Teléfono:</strong> {citaSeleccionada.telefono}<br />
                    <strong>Email:</strong> {citaSeleccionada.email}<br />
                    <strong>Fecha de Cita:</strong> {formatearFecha(citaSeleccionada.fecha)} - {citaSeleccionada.hora}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-base font-semibold text-[#667eea] mb-2">Consulta Médica</div>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#667eea]">
                    <strong>Motivo:</strong> {citaSeleccionada.motivo}<br />
                    <strong>Diagnóstico:</strong> {citaSeleccionada.diagnostico}<br />
                    <strong>Estado:</strong> <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${citaSeleccionada.estado === 'confirmada' ? 'bg-green-100 text-green-800' : citaSeleccionada.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : citaSeleccionada.estado === 'completada' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{citaSeleccionada.estado.toUpperCase()}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-base font-semibold text-[#667eea] mb-2">Tratamiento</div>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#667eea]">
                    {citaSeleccionada.tratamiento}<br />
                    <strong>Próxima Cita:</strong> {citaSeleccionada.proximaCita}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="text-base font-semibold text-[#667eea] mb-2">Observaciones Médicas</div>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#667eea]">
                    {citaSeleccionada.observaciones}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button className="p-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => imprimirHistorial(citaSeleccionada.id)}>
                    📄 Imprimir Historial
                  </button>
                  <button className="p-3 bg-gray-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => exportarPDF(citaSeleccionada.id)}>
                    📑 Exportar PDF
                  </button>
                  {citaSeleccionada.estado === 'pendiente' && (
                    <>
                      <button className="p-3 bg-green-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => confirmarCita(citaSeleccionada.id)}>
                        ✓ Confirmar Cita
                      </button>
                      <button className="p-3 bg-yellow-500 text-black rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => reagendarCita(citaSeleccionada.id)}>
                        📅 Reagendar
                      </button>
                      <button className="p-3 bg-red-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => cancelarCita(citaSeleccionada.id)}>
                        ❌ Cancelar
                      </button>
                    </>
                  )}
                  {citaSeleccionada.estado === 'confirmada' && (
                    <>
                      <button className="p-3 bg-green-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => marcarCompletada(citaSeleccionada.id)}>
                        ✓ Marcar Completada
                      </button>
                      <button className="p-3 bg-yellow-500 text-black rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={() => agregarObservaciones(citaSeleccionada.id)}>
                        📝 Agregar Observaciones
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center p-16 text-gray-600">
                <div className="text-6xl mb-5 opacity-50">📋</div>
                <p>Selecciona una cita para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

ReactDOM.render(<Detalles />, document.getElementById('root'));