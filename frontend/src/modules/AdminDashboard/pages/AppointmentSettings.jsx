import React, { useState } from 'react';
import '../AdminDashboard.css';

const AppointmentSettings = () => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [schedules, setSchedules] = useState({
        monday: { start: '08:00', end: '12:00' },
        tuesday: { start: '08:00', end: '12:00' },
        wednesday: { start: '14:00', end: '18:00' }, // 02:00 PM - 06:00 PM
        thursday: { start: '08:00', end: '12:00' },
        friday: { start: '08:00', end: '12:00' },
    });
    
    // Función de ejemplo para guardar en la base de datos (Backend API Call)
    const handleSaveSchedule = () => {
        if (!selectedDoctor) {
            alert('Por favor, selecciona un médico.');
            return;
        }
        
        const dataToSave = {
            doctorId: selectedDoctor,
            schedules: schedules,
            // NOTA: Aquí se hace la llamada a la API:
            // fetch('http://localhost:8000/api/admin/schedule', { method: 'POST', body: JSON.stringify(dataToSave) })
        };
        console.log('Guardando horarios para:', dataToSave);
        alert(`Horarios guardados para el médico ${selectedDoctor}. (Ver consola)`);
    };
    
    // Lista de médicos simulados (debería venir del backend)
    const doctors = [
        { id: 'dr-rodriguez', name: 'Dr. Carlos Rodríguez - Cardiología' },
        { id: 'dra-martinez', name: 'Dra. Ana Martínez - Pediatría' },
        { id: 'dr-lopez', name: 'Dr. Miguel López - Neurología' },
        { id: 'dra-garcia', name: 'Dra. Laura García - Ginecología' },
    ];
    
    const days = [
        { key: 'monday', name: 'Lunes' },
        { key: 'tuesday', name: 'Martes' },
        { key: 'wednesday', name: 'Miércoles' },
        { key: 'thursday', name: 'Jueves' },
        { key: 'friday', name: 'Viernes' },
    ];

    return (
        <div className="admin-page appointment-settings">
            <div className="admin-card card-schedule full-width-card">
                <div className="card-header">
                    <h3 className="card-title">📅 Configurar Disponibilidad</h3>
                    <span className="card-icon">⏰</span>
                </div>

                <div className="form-section">
                    <div className="form-group">
                        <label>👨‍⚕️ Médico:</label>
                        <select id="doctorSelect" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} style={{ marginBottom: '20px' }}>
                            <option value="">Seleccionar médico...</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="availability-section">
                        <h4 style={{ marginBottom: '20px', color: '#495057' }}>⏰ Configurar horarios disponibles:</h4>

                        {days.map(day => (
                            <div key={day.key} className="schedule-grid">
                                <div className="schedule-day">📅 {day.name}</div>
                                <input 
                                    type="time" 
                                    className="schedule-input" 
                                    value={schedules[day.key].start}
                                    onChange={(e) => setSchedules({...schedules, [day.key]: {...schedules[day.key], start: e.target.value}})}
                                />
                                <input 
                                    type="time" 
                                    className="schedule-input" 
                                    value={schedules[day.key].end}
                                    onChange={(e) => setSchedules({...schedules, [day.key]: {...schedules[day.key], end: e.target.value}})}
                                />
                            </div>
                        ))}

                        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => alert("Lógica para agregar otra franja horaria.")}>
                                ➕ Agregar Disponibilidad
                            </button>
                            <button className="btn btn-success" onClick={handleSaveSchedule}>
                                💾 Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentSettings;