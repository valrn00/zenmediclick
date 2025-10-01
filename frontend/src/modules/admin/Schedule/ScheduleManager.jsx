// frontend/src/modules/admin/components/Schedule/ScheduleManager.jsx

import React, { useState, useEffect } from 'react';
import AdminAPI from '../../services/adminAPI';
import ScheduleForm from './ScheduleForm';
import './Schedule.css';

const ScheduleManager = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await AdminAPI.getUsuarios({ role: 'medico' });
      setDoctors(data);
    } catch (error) {
      console.error('Error cargando médicos:', error);
    }
  };

  const handleSaveSchedule = async (scheduleData) => {
    if (!selectedDoctor) {
      alert('Por favor selecciona un médico');
      return;
    }

    try {
      setLoading(true);
      // Aquí llamarías a la API para guardar horarios
      // await AdminAPI.saveSchedule(selectedDoctor, scheduleData);
      console.log('Guardando horarios:', { selectedDoctor, scheduleData });
      alert('Horarios guardados exitosamente');
    } catch (error) {
      console.error('Error guardando horarios:', error);
      alert('Error al guardar horarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card card-schedule full-width-card">
      <div className="card-header">
        <h3 className="card-title">📅 Configurar Disponibilidad</h3>
        <span className="card-icon">⏰</span>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>👨‍⚕️ Médico:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            style={{ marginBottom: '20px' }}
          >
            <option value="">Seleccionar médico...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.nombre} - {doctor.especialidad || 'Sin especialidad'}
              </option>
            ))}
          </select>
        </div>

        <ScheduleForm
          doctorId={selectedDoctor}
          onSave={handleSaveSchedule}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ScheduleManager;