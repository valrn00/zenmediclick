// Variables globales
let selectedAppointment = null;
let appointments = [
    {
        time: "8:00 AM",
        patient: "Nicolás Sánchez",
        status: "Confirmada",
        date: "25/06/2025",
        reason: "Dolor de cabeza"
    },
    {
        time: "9:00 AM",
        patient: "Andrea Rodriguez",
        status: "Pendiente",
        date: "25/06/2025",
        reason: "Control rutinario"
    },
    {
        time: "10:00 AM",
        patient: "Susy Pérez",
        status: "Cancelar",
        date: "25/06/2025",
        reason: "Consulta general"
    }
];

// Función de login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username.trim() === '' || password.trim() === '') {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Simulación de login exitoso
    if (username === 'medico' && password === '123456') {
        alert('Login exitoso. Redirigiendo a la agenda...');
        showScreen('agenda');
    } else {
        alert('Credenciales incorrectas. Use: medico / 123456');
    }
}

// Función para recuperar contraseña
function forgotPassword() {
    alert('Se ha enviado un enlace de recuperación a su correo electrónico.');
}

// Función para buscar por fecha
function searchDate() {
    const date = document.getElementById('dateSearch').value;
    
    if (date.trim() === '') {
        alert('Por favor, ingrese una fecha');
        return;
    }
    
    // Simulación de búsqueda
    console.log('Buscando citas para la fecha:', date);
    alert(`Buscando citas para la fecha: ${date}`);
}

// Función para seleccionar una cita
function selectAppointment(row) {
    // Remover selección anterior
    const previousSelected = document.querySelector('.table tbody tr.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    // Seleccionar nueva fila
    row.classList.add('selected');
    
    // Obtener datos de la cita
    const cells = row.getElementsByTagName('td');
    selectedAppointment = {
        time: cells[0].textContent,
        patient: cells[1].textContent,
        status: cells[2].textContent,
        date: "25/06/2025", // Fecha fija para el ejemplo
        reason: "Dolor de cabeza" // Motivo fijo para el ejemplo
    };
    
    console.log('Cita seleccionada:', selectedAppointment);
}

// Función para mostrar detalles
function showDetails() {
    if (!selectedAppointment) {
        alert('Por favor, seleccione una cita de la tabla');
        return;
    }
    
    // Actualizar información en la pantalla de detalles
    document.getElementById('detailPatient').textContent = selectedAppointment.patient;
    document.getElementById('detailDate').textContent = selectedAppointment.date;
    document.getElementById('detailTime').textContent = selectedAppointment.time;
    document.getElementById('detailReason').textContent = selectedAppointment.reason;
    document.getElementById('detailStatus').textContent = selectedAppointment.status;
    
    showScreen('detalles');
}

// Función para mostrar observaciones
function showObservations() {
    if (!selectedAppointment) {
        alert('Por favor, seleccione una cita de la tabla');
        return;
    }
    
    // Actualizar información en la pantalla de observaciones
    document.getElementById('obsPatient').textContent = selectedAppointment.patient;
    document.getElementById('obsDate').textContent = selectedAppointment.date;
    document.getElementById('obsTime').textContent = selectedAppointment.time;
    
    // Limpiar el área de texto
    document.getElementById('medicalObservations').value = '';
    
    showScreen('observaciones');
}

// Función para volver a la agenda
function backToAgenda() {
    showScreen('agenda');
}

// Función para guardar observaciones
function saveObservations() {
    const observations = document.getElementById('medicalObservations').value;
    
    if (observations.trim() === '') {
        alert('Por favor, ingrese las observaciones médicas');
        return;
    }
    
    // Simulación de guardado
    alert(`Observaciones guardadas exitosamente para ${selectedAppointment.patient}`);
    console.log('Observaciones guardadas:', {
        patient: selectedAppointment.patient,
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        observations: observations
    });
    
    // Volver a la agenda
    showScreen('agenda');
}

// Función para cancelar observaciones
function cancelObservations() {
    if (document.getElementById('medicalObservations').value.trim() !== '') {
        if (confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
            showScreen('agenda');
        }
    } else {
        showScreen('agenda');
    }
}

// Función para inicializar la aplicación
function initApp() {
    console.log('Aplicación iniciada');
    
    // Configurar eventos de teclado
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            
            // Si estamos en el login
            if (activeElement.id === 'username' || activeElement.id === 'password') {
                login();
            }
        }
    });
    
    // Configurar focus automático en campos de texto
    const usernameField = document.getElementById('username');
    if (usernameField) {
        usernameField.focus();
    }
}

// Función para validar formularios
function validateForm(formType) {
    switch (formType) {
        case 'login':
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            return username.trim() !== '' && password.trim() !== '';
        
        case 'observations':
            const observations = document.getElementById('medicalObservations').value;
            return observations.trim() !== '';
        
        default:
            return true;
    }
}

// Función para formatear fecha
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    };
    return new Date(date).toLocaleDateString('es-ES', options);
}

// Función para generar reporte
function generateReport() {
    const report = {
        date: new Date().toISOString(),
        appointments: appointments,
        selectedAppointment: selectedAppointment
    };
    
    console.log('Reporte generado:', report);
    return report;
}

// Inicializar la aplicación cuando se carga
