/**
 * ZENMEDICLICK - GESTIÓN DE HORARIOS
 * Funciones para administrar disponibilidad y horarios de médicos
 */

// ==========================================
// DATOS DE HORARIOS Y DISPONIBILIDAD
// ==========================================

// Almacén de horarios de médicos
let doctorSchedules = {
    'dr-rodriguez': {
        name: 'Dr. Carlos Rodríguez',
        specialty: 'Cardiología',
        schedule: {
            monday: { start: '08:00', end: '12:00', active: true },
            tuesday: { start: '08:00', end: '12:00', active: true },
            wednesday: { start: '14:00', end: '18:00', active: true },
            thursday: { start: '08:00', end: '12:00', active: true },
            friday: { start: '08:00', end: '12:00', active: true },
            saturday: { start: '', end: '', active: false },
            sunday: { start: '', end: '', active: false }
        },
        exceptions: [], // Días especiales sin disponibilidad
        lastUpdated: new Date().toISOString()
    },
    'dra-martinez': {
        name: 'Dra. Ana Martínez',
        specialty: 'Pediatría',
        schedule: {
            monday: { start: '09:00', end: '13:00', active: true },
            tuesday: { start: '09:00', end: '13:00', active: true },
            wednesday: { start: '15:00', end: '19:00', active: true },
            thursday: { start: '09:00', end: '13:00', active: true },
            friday: { start: '09:00', end: '13:00', active: true },
            saturday: { start: '', end: '', active: false },
            sunday: { start: '', end: '', active: false }
        },
        exceptions: [],
        lastUpdated: new Date().toISOString()
    }
};

// Días de la semana
const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes', 
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
};

// ==========================================
// FUNCIONES PRINCIPALES DE HORARIOS
// ==========================================

/**
 * Agregar nueva disponibilidad
 */
function addAvailability() {
    const selectedDoctor = document.getElementById('doctorSelect').value;
    
    if (!selectedDoctor) {
        showMessage('❌ Por favor selecciona un médico', 'error');
        return;
    }
    
    const scheduleData = collectScheduleData();
    const validation = validateScheduleData(scheduleData);
    
    if (!validation.isValid) {
        showMessage(`❌ ${validation.message}`, 'error');
        return;
    }
    
    // Actualizar horarios del médico
    updateDoctorSchedule(selectedDoctor, scheduleData);
    
    showMessage('➕ Nueva disponibilidad agregada correctamente', 'success');
    logAuditAction('ADD_AVAILABILITY', selectedDoctor, { schedule: scheduleData });
}

/**
 * Guardar cambios de horario
 */
function saveScheduleChanges() {
    const selectedDoctor = document.getElementById('doctorSelect').value;
    
    if (!selectedDoctor) {
        showMessage('❌ Por favor selecciona un médico', 'error');
        return;
    }
    
    const scheduleData = collectScheduleData();
    const validation = validateScheduleData(scheduleData);
    
    if (!validation.isValid) {
        showMessage(`❌ ${validation.message}`, 'error');
        return;
    }
    
    // Confirmar cambios importantes
    if (hasSignificantChanges(selectedDoctor, scheduleData)) {
        if (!confirm('⚠️ Los cambios afectarán las citas existentes. ¿Continuar?')) {
            return;
        }
    }
    
    // Guardar cambios
    updateDoctorSchedule(selectedDoctor, scheduleData);
    
    // Mostrar resumen de cambios
    showScheduleSummary(selectedDoctor);
    
    showMessage('💾 Horarios guardados exitosamente', 'success');
    logAuditAction('SAVE_SCHEDULE_CHANGES', selectedDoctor, { newSchedule: scheduleData });
}

/**
 * Recolectar datos del formulario de horarios
 * @returns {Object} Datos de horario recolectados
 */
function collectScheduleData() {
    const schedule = {};
    
    weekDays.forEach(day => {
        const startElement = document.getElementById(`${day}-start`);
        const endElement = document.getElementById(`${day}-end`);
        
        if (startElement && endElement) {
            const start = startElement.value;
            const end = endElement.value;
            
            schedule[day] = {
                start: start,
                end: end,
                active: !!(start && end) // Activo si ambos campos tienen valor
            };
        }
    });
    
    return schedule;
}

/**
 * Validar datos de horario
 * @param {Object} scheduleData - Datos del horario a validar
 * @returns {Object} Resultado de validación
 */
function validateScheduleData(scheduleData) {
    // Verificar que al menos un día esté activo
    const activeDays = Object.values(scheduleData).filter(day => day.active);
    if (activeDays.length === 0) {
        return { isValid: false, message: 'Debe configurar al menos un día de disponibilidad' };
    }
    
    // Validar horarios lógicos
    for (const [day, data] of Object.entries(scheduleData)) {
        if (data.active) {
            if (!data.start || !data.end) {
                return { 
                    isValid: false, 
                    message: `Horario incompleto para ${dayNames[day]}` 
                };
            }
            
            if (data.start >= data.end) {
                return { 
                    isValid: false, 
                    message: `Horario inválido para ${dayNames[day]}: la hora de inicio debe ser anterior a la de fin` 
                };
            }
            
            // Validar duración mínima (30 minutos)
            const startMinutes = timeToMinutes(data.start);
            const endMinutes = timeToMinutes(data.end);
            if (endMinutes - startMinutes < 30) {
                return {
                    isValid: false,
                    message: `La disponibilidad mínima debe ser de 30 minutos para ${dayNames[day]}`
                };
            }
        }
    }
    
    return { isValid: true };
}

/**
 * Convertir tiempo a minutos
 * @param {string} timeString - Tiempo en formato HH:MM
 * @returns {number} Minutos totales
 */
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Actualizar horario del médico
 * @param {string} doctorId - ID del médico
 * @param {Object} newSchedule - Nuevo horario
 */
function updateDoctorSchedule(doctorId, newSchedule) {
    if (!doctorSchedules[doctorId]) {
        doctorSchedules[doctorId] = {
            name: getDoctorName(doctorId),
            specialty: getDoctorSpecialty(doctorId),
            schedule: {},
            exceptions: [],
            lastUpdated: new Date().toISOString()
        };
    }
    
    doctorSchedules[doctorId].schedule = { ...newSchedule };
    doctorSchedules[doctorId].lastUpdated = new Date().toISOString();
    
    // En producción, aquí se enviaría al servidor
    console.log('💾 Horario actualizado:', doctorSchedules[doctorId]);
}

/**
 * Verificar si hay cambios significativos
 * @param {string} doctorId - ID del médico
 * @param {Object} newSchedule - Nuevo horario
 * @returns {boolean} True si hay cambios significativos
 */
function hasSignificantChanges(doctorId, newSchedule) {
    if (!doctorSchedules[doctorId]) return true;
    
    const currentSchedule = doctorSchedules[doctorId].schedule;
    
    // Verificar si se desactivaron días que estaban activos
    for (const day of weekDays) {
        const wasActive = currentSchedule[day]?.active || false;
        const isActive = newSchedule[day]?.active || false;
        
        if (wasActive && !isActive) {
            return true; // Se desactivó un día que estaba disponible
        }
        
        // Verificar cambios de horario en días activos
        if (wasActive && isActive) {
            if (currentSchedule[day].start !== newSchedule[day].start ||
                currentSchedule[day].end !== newSchedule[day].end) {
                return true;
            }
        }
    }
    
    return false;
}

// ==========================================
// VISUALIZACIÓN Y CARGA DE HORARIOS
// ==========================================

/**
 * Cargar horario del médico seleccionado
 */
function loadDoctorSchedule() {
    const selectedDoctor = document.getElementById('doctorSelect').value;
    
    if (!selectedDoctor) {
        clearScheduleForm();
        return;
    }
    
    const doctorData = doctorSchedules[selectedDoctor];
    
    if (doctorData && doctorData.schedule) {
        // Cargar horarios existentes
        weekDays.forEach(day => {
            const startElement = document.getElementById(`${day}-start`);
            const endElement = document.getElementById(`${day}-end`);
            
            if (startElement && endElement && doctorData.schedule[day]) {
                startElement.value = doctorData.schedule[day].start || '';
                endElement.value = doctorData.schedule[day].end || '';
            }
        });
        
        showMessage(`📅 Horarios cargados para ${doctorData.name}`, 'info');
    } else {
        clearScheduleForm();
        showMessage(`ℹ️ No hay horarios configurados para este médico`, 'info');
    }
}

/**
 * Limpiar formulario de horarios
 */
function clearScheduleForm() {
    weekDays.forEach(day => {
        const startElement = document.getElementById(`${day}-start`);
        const endElement = document.getElementById(`${day}-end`);
        
        if (startElement && endElement) {
            startElement.value = '';
            endElement.value = '';
        }
    });
}

/**
 * Mostrar resumen de horarios
 * @param {string} doctorId - ID del médico
 */
function showScheduleSummary(doctorId) {
    const doctorData = doctorSchedules[doctorId];
    if (!doctorData) return;
    
    const activeDays = Object.entries(doctorData.schedule)
        .filter(([_, data]) => data.active)
        .map(([day, data]) => `${dayNames[day]}: ${data.start}-${data.end}`)
        .join('<br>');
    
    const totalHours = calculateWeeklyHours(doctorData.schedule);
    
    const summary = `
        📋 <strong>Resumen de Horarios - ${doctorData.name}</strong><br>
        🕒 Horas semanales: ${totalHours.toFixed(1)} horas<br>
        📅 Días activos:<br>${activeDays}
    `;
    
    showMessage(summary, 'success');
}

/**
 * Calcular horas semanales totales
 * @param {Object} schedule - Horario del médico
 * @returns {number} Total de horas semanales
 */
function calculateWeeklyHours(schedule) {
    let totalMinutes = 0;
    
    Object.values(schedule).forEach(day => {
        if (day.active && day.start && day.end) {
            const startMinutes = timeToMinutes(day.start);
            const endMinutes = timeToMinutes(day.end);
            totalMinutes += endMinutes - startMinutes;
        }
    });
    
    return totalMinutes / 60; // Convertir a horas
}

// ==========================================
// GESTIÓN DE EXCEPCIONES Y DÍAS ESPECIALES
// ==========================================

/**
 * Agregar excepción de día
 * @param {string} doctorId - ID del médico
 * @param {string} date - Fecha de la excepción
 * @param {string} reason - Razón de la excepción
 */
function addScheduleException(doctorId, date, reason) {
    if (!doctorSchedules[doctorId]) return;
    
    const exception = {
        date: date,
        reason: reason,
        addedAt: new Date().toISOString(),
        addedBy: 'admin@zenmediclick.com'
    };
    
    doctorSchedules[doctorId].exceptions.push(exception);
    
    showMessage(`🚫 Excepción agregada para ${formatDate(date)}: ${reason}`, 'info');
    logAuditAction('ADD_SCHEDULE_EXCEPTION', doctorId, exception);
}

/**
 * Remover excepción de día
 * @param {string} doctorId - ID del médico
 * @param {string} date - Fecha de la excepción a remover
 */
function removeScheduleException(doctorId, date) {
    if (!doctorSchedules[doctorId]) return;
    
    const initialLength = doctorSchedules[doctorId].exceptions.length;
    doctorSchedules[doctorId].exceptions = doctorSchedules[doctorId].exceptions
        .filter(exception => exception.date !== date);
    
    if (doctorSchedules[doctorId].exceptions.length < initialLength) {
        showMessage(`✅ Excepción removida para ${formatDate(date)}`, 'success');
        logAuditAction('REMOVE_SCHEDULE_EXCEPTION', doctorId, { date });
    }
}

// ==========================================
// UTILIDADES Y HELPERS
// ==========================================

/**
 * Obtener nombre del médico por ID
 * @param {string} doctorId - ID del médico
 * @returns {string} Nombre del médico
 */
function getDoctorName(doctorId) {
    const doctorNames = {
        'dr-rodriguez': 'Dr. Carlos Rodríguez',
        'dra-martinez': 'Dra. Ana Martínez',
        'dr-lopez': 'Dr. Miguel López',
        'dra-garcia': 'Dra. Laura García'
    };
    return doctorNames[doctorId] || 'Médico Desconocido';
}

/**
 * Obtener especialidad del médico por ID
 * @param {string} doctorId - ID del médico
 * @returns {string} Especialidad del médico
 */
function getDoctorSpecialty(doctorId) {
    const specialties = {
        'dr-rodriguez': 'Cardiología',
        'dra-martinez': 'Pediatría',
        'dr-lopez': 'Neurología',
        'dra-garcia': 'Ginecología'
    };
    return specialties[doctorId] || 'Medicina General';
}

/**
 * Generar horarios disponibles para citas
 * @param {string} doctorId - ID del médico
 * @param {string} date - Fecha para generar horarios
 * @returns {Array} Array de horarios disponibles
 */
function generateAvailableSlots(doctorId, date) {
    const doctorData = doctorSchedules[doctorId];
    if (!doctorData) return [];
    
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const daySchedule = doctorData.schedule[dayOfWeek];
    
    if (!daySchedule || !daySchedule.active) return [];
    
    // Verificar excepciones
    const hasException = doctorData.exceptions.some(exc => exc.date === date);
    if (hasException) return [];
    
    // Generar slots de 30 minutos
    const slots = [];
    const startMinutes = timeToMinutes(daySchedule.start);
    const endMinutes = timeToMinutes(daySchedule.end);
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeSlot = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        slots.push(timeSlot);
    }
    
    return slots;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Configurar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Listener para cambio de médico seleccionado
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
        doctorSelect.addEventListener('change', loadDoctorSchedule);
    }
    
    // Listener para validación en tiempo real de horarios
    weekDays.forEach(day => {
        const startInput = document.getElementById(`${day}-start`);
        const endInput = document.getElementById(`${day}-end`);
        
        if (startInput && endInput) {
            [startInput, endInput].forEach(input => {
                input.addEventListener('change', validateTimeInputs);
            });
        }
    });
});

/**
 * Validar inputs de tiempo en tiempo real
 * @param {Event} event - Evento de cambio
 */
function validateTimeInputs(event) {
    const input = event.target;
    const dayMatch = input.id.match(/(\w+)-(start|end)/);
    
    if (!dayMatch) return;
    
    const [, day, type] = dayMatch;
    const startInput = document.getElementById(`${day}-start`);
    const endInput = document.getElementById(`${day}-end`);
    
    if (startInput.value && endInput.value) {
        if (startInput.value >= endInput.value) {
            input.style.borderColor = '#dc3545';
            showMessage(`⚠️ Horario inválido para ${dayNames[day]}`, 'error');
        } else {
            startInput.style.borderColor = '#28a745';
            endInput.style.borderColor = '#28a745';
        }
    }
}