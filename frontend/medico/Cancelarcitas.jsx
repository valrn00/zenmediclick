import React, { useState, useEffect } from 'react';
import { useMedico } from '../../zenmediclick-medico/sistema-citas-medicas/MedicoContext.jsx';
import { Link } from 'react-router-dom';

const CancelarCitas = () => {
  const { cargarAgenda, cancelarCita, formatearFecha, showMessage, loading } = useMedico();
  const [citas, setCitas] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCitas = async () => {
      const hoy = new Date().toISOString().split('T')[0];
      const citasData = await cargarAgenda(hoy);
      setCitas(citasData.filter(cita => ['programada', 'confirmada'].includes(cita.estado)));
    };
    fetchCitas();
  }, [cargarAgenda]);

  const handleCancel = (citaId) => {
    const cita = citas.find(c => c.id === citaId);
    if (cita) {
      setSelectedCita(cita);
      setShowModal(true);
    }
  };

  const confirmCancel = async () => {
    if (selectedCita) {
      const success = await cancelarCita(selectedCita.id, new Date().toISOString().split('T')[0]);
      if (success) {
        setCitas(citas.map(c => c.id === selectedCita.id ? { ...c, estado: 'cancelada' } : c));
        setShowModal(false);
        setSelectedCita(null);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCita(null);
  };

  if (loading) {
    return <div className="text-center text-white p-10">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-sans">
      <header className="flex justify-between items-center p-5 md:p-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-4 text-2xl font-bold">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] rounded-full flex items-center justify-center text-xl">🏥</div>
          <span>ZenMediClick</span>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Inicio</Link>
          <Link to="/agenda" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Agenda</Link>
          <Link to="/detalles" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Detalles</Link>
          <Link to="/observaciones" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Observaciones</Link>
          <Link to="/cancelar-citas" className="px-5 py-2 bg-white/40 rounded-full text-white hover:bg-white/50 hover:-translate-y-0.5 transition-all">Cancelar Citas</Link>
        </div>
      </header>

      <main className="p-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-8 text-shadow-md">Cancelar Citas</h1>

        <div className="bg-white/95 text-gray-800 p-10 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 border-b-2 border-gray-200 pb-2">Lista de Citas</h2>
          {citas.length === 0 ? (
            <div className="text-center p-16 text-gray-600">
              <div className="text-6xl mb-5 opacity-50">📅</div>
              <p>No hay citas disponibles para cancelar</p>
            </div>
          ) : (
            <table className="w-full border-collapse bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Fecha</th>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Hora</th>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Paciente</th>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Estado</th>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Teléfono</th>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Motivo</th>
                  <th className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 text-left font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {citas.map(cita => (
                  <tr key={cita.id} className="hover:bg-gray-100">
                    <td className="p-4 border-b border-gray-100">{formatearFecha(cita.fecha)}</td>
                    <td className="p-4 border-b border-gray-100">{cita.hora}</td>
                    <td className="p-4 border-b border-gray-100">{cita.paciente.nombre}</td>
                    <td className="p-4 border-b border-gray-100">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' : cita.estado === 'programada' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">{cita.paciente.telefono || 'No especificado'}</td>
                    <td className="p-4 border-b border-gray-100">{cita.motivo || 'No especificado'}</td>
                    <td className="p-4 border-b border-gray-100">
                      {['programada', 'confirmada'].includes(cita.estado) ? (
                        <button
                          className="bg-red-500 text-white px-2.5 py-1 rounded-md hover:bg-red-600 transition-all"
                          onClick={() => handleCancel(cita.id)}
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span className="text-gray-500">No disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white text-gray-800 p-8 rounded-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <span className="float-right text-2xl cursor-pointer text-gray-600" onClick={closeModal}>&times;</span>
            <h2 className="text-2xl font-semibold mb-5">Confirmar Cancelación</h2>
            <p className="mb-5">
              ¿Está seguro que desea cancelar la cita para <strong>{selectedCita?.paciente.nombre}</strong> el <strong>{formatearFecha(selectedCita?.fecha)}</strong> a las <strong>{selectedCita?.hora}</strong>?
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                onClick={confirmCancel}
              >
                Sí, Cancelar
              </button>
              <button
                className="flex-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                onClick={closeModal}
              >
                No, Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelarCitas;