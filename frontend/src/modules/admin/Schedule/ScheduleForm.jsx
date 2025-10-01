// frontend/src/modules/admin/components/Schedule/ScheduleForm.jsx

import React, { useState } from 'react';

const ScheduleForm = ({ doctorId, onSave, loading }) => {
  const [schedule, setSchedule] = useState({
    monday: { start: '08:00', end: '12:00' },
    tuesday: { start: '08:00', end: '12:00' },
    wednesday: { start: '14:00', end: '18:00' },
    thursday: { start: '08:00', end: '12:00' },
    friday: { start: '08:00', end: '12:00' }
  });

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes'
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Validar que las horas de inicio sean menores a las de fin
    for (const [day, times] of Object.entries(schedule)) {
      if (times.start && times.end && times.start >= times.end) {
        alert(`Horario inválido para ${dayNames[day]}: la hora de inicio debe ser anterior a la de fin`);
        return;
      }
    }
    
    onSave(schedule);
  };

  return (
    <div className="availability-section">
      <h4 style={{ marginBottom: '20px', color: '#495057' }}>
        ⏰ Configurar horarios disponibles:
      </h4>

      {Object.entries(dayNames).map(([day, name]) => (
        <div key={day} className="schedule-grid">
          <div className="schedule-day">📅 {name}</div>
          <input
            type="time"
            className="schedule-input"
            value={schedule[day]?.start || ''}
            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
          />
          <input
            type="time"
            className="schedule-input"
            value={schedule[day]?.end || ''}
            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
          />
        </div>
      ))}

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={loading || !doctorId}
        >
          {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleForm;