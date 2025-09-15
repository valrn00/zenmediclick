// Navegación entre pantallas

// Función principal para cambiar pantallas
function showScreen(screenId) {
    // Ocultar todas las pantallas
    const allScreens = document.querySelectorAll('.wireframe');
    allScreens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Actualizar botones de navegación
        updateNavigationButtons(screenId);
        
        // Ejecutar funciones específicas según la pantalla
        onScreenChange(screenId);
    }
}

// Función para actualizar botones de navegación
function updateNavigationButtons(activeScreenId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Mapear IDs de pantalla con botones
    const screenButtonMap = {
        'login': 0,
        'agenda': 1,
        'detalles': 2,
        'observaciones': 3
    };
    
    const activeButtonIndex = screenButtonMap[activeScreenId];
    if (activeButtonIndex !== undefined && navButtons[activeButtonIndex]) {
        navButtons[activeButtonIndex].classList.add('active');
    }
}

// Función que se ejecuta cuando cambia de pantalla
function onScreenChange(screenId) {
    switch (screenId) {
        case 'login':
            onLoginScreen();
            break;
        case 'agenda':
            onAgendaScreen();
            break;
        case 'detalles':
            onDetailsScreen();
            break;
        case 'observaciones':
            onObservationsScreen();
            break;
    }
}

// Funciones específicas para cada pantalla
function onLoginScreen() {
    console.log('Pantalla de login activada');
    
    // Limpiar campos
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    if (usernameField) {
        usernameField.value = '';
        usernameField.focus();
    }
    if (passwordField) {
        passwordField.value = '';
    }
    
    // Configurar eventos de teclado específicos para login
    setupLoginKeyEvents();
}

function onAgendaScreen() {
    console.log('Pantalla de agenda activada');
    
    // Actualizar fecha actual
    const dateField = document.getElementById('dateSearch');
    if (dateField && dateField.value === 'v') {
        const today = new Date();
        const formattedDate = formatDate(today);
        dateField.value = formattedDate;
    }
    
    // Refrescar tabla de citas
    refreshAppointmentTable();
}

function onDetailsScreen() {
    console.log('Pantalla de detalles activada');
    
    // Verificar que hay una cita seleccionada
    if (!selectedAppointment) {
        alert('No hay cita seleccionada. Regresando a la agenda.');
        showScreen('agenda');
        return;
    }
    
    // Animar entrada de detalles
    animateDetailsEntry();
}

function onObservationsScreen() {
    console.log('Pantalla de observaciones activada');
    
    // Verificar que hay una cita seleccionada
    if (!selectedAppointment) {
        alert('No hay cita seleccionada. Regresando a la agenda.');
        showScreen('agenda');
        return;
    }
    
    // Configurar el área de texto
    setupObservationsTextarea();
}

// Funciones auxiliares
function setupLoginKeyEvents() {
    const inputs = document.querySelectorAll('#login input');
    inputs.forEach((input, index) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    login();
                }
            }
        });
    });
}

function refreshAppointmentTable() {
    const tableBody = document.getElementById('appointmentTable');
    if (!tableBody) return;
    
    // Limpiar tabla
    tableBody.innerHTML = '';
    
    // Recrear filas
    appointments.forEach((appointment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.time}</td>
            <td>${appointment.patient}</td>
            <td>${appointment.status}</td>
        `;
        row.addEventListener('click', () => selectAppointment(row));
        tableBody.appendChild(row);
    });
}

function animateDetailsEntry() {
    const detailsBox = document.querySelector('#detalles .details-box');
    if (detailsBox) {
        detailsBox.style.opacity = '0';
        detailsBox.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            detailsBox.style.transition = 'all 0.3s ease';
            detailsBox.style.opacity = '1';
            detailsBox.style.transform = 'translateY(0)';
        }, 100);
    }
}

function setupObservationsTextarea() {
    const textarea = document.getElementById('medicalObservations');
    if (textarea) {
        textarea.focus();
        
        // Configurar auto-guardado cada 30 segundos
        let autoSaveInterval = setInterval(() => {
            if (document.getElementById('observaciones').classList.contains('active')) {
                autoSaveObservations();
            } else {
                clearInterval(autoSaveInterval);
            }
        }, 30000);
    }
}

// Navegación con teclado
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Alt + número para cambio rápido de pantalla
        if (e.altKey) {
            switch (e.code) {
                case 'Digit1':
                    e.preventDefault();
                    showScreen('login');
                    break;
                case 'Digit2':
                    e.preventDefault();
                    showScreen('agenda');
                    break;
                case 'Digit3':
                    e.preventDefault();
                    if (selectedAppointment) showScreen('detalles');
                    break;
                case 'Digit4':
                    e.preventDefault();
                    if (selectedAppointment) showScreen('observaciones');
                    break;
            }
        }
        
        // Escape para volver a pantalla anterior
        if (e.key === 'Escape') {
            const currentScreen = document.querySelector('.wireframe.active');
            if (currentScreen) {
                switch (currentScreen.id) {
                    case 'detalles':
                    case 'observaciones':
                        showScreen('agenda');
                        break;
                    case 'agenda':
                        showScreen('login');
                        break;
                }
            }
        }
    });
}

// Auto-guardado de observaciones
function autoSaveObservations() {
    const textarea = document.getElementById('medicalObservations');
    if (textarea && textarea.value.trim() !== '') {
        console.log('Auto-guardado de observaciones:', textarea.value);
        // Aquí iría la lógica de auto-guardado
        
        // Mostrar indicador visual de guardado
        showAutoSaveIndicator();
    }
}

function showAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.textContent = 'Guardado automáticamente';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 300);
    }, 2000);
}

// Historial de navegación
let navigationHistory = ['login'];

function addToHistory(screenId) {
    if (navigationHistory[navigationHistory.length - 1] !== screenId) {
        navigationHistory.push(screenId);
    }
}

function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Remover pantalla actual
        const previousScreen = navigationHistory[navigationHistory.length - 1];
        showScreen(previousScreen);
    }
}

// Función para obtener la pantalla actual
function getCurrentScreen() {
    const activeScreen = document.querySelector('.wireframe.active');
    return activeScreen ? activeScreen.id : null;
}

// Validación antes de cambiar pantalla
function canChangeScreen(fromScreen, toScreen) {
    // Verificar si hay cambios no guardados
    if (fromScreen === 'observaciones') {
        const textarea = document.getElementById('medicalObservations');
        if (textarea && textarea.value.trim() !== '') {
            return confirm('Hay cambios no guardados. ¿Desea continuar?');
        }
    }
    
    // Verificar permisos según el flujo de la aplicación
    if (toScreen === 'detalles' || toScreen === 'observaciones') {
        if (!selectedAppointment) {
            alert('Debe seleccionar una cita primero');
            return false;
        }
    }
    
    return true;
}

// Inicializar navegación
function initNavigation() {
    console.log('Sistema de navegación iniciado');
    
    // Mostrar pantalla inicial
    showScreen('login');
    
    // Configurar navegación por teclado
    setupKeyboardNavigation();
    
    // Agregar animaciones CSS
    addNavigationAnimations();
}

function addNavigationAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initApp();
});