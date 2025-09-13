// Exponer funciones globales para evitar errores de 'definida pero no usada' y permitir uso desde HTML
window.cancelarCita = cancelarCita;
window.verDetallesCita = verDetallesCita;
window.logout = logout;
window.checkAuth = checkAuth;
window.handleNetworkError = handleNetworkError;
// Configuración de la API
const API_BASE = 'http://localhost:5000/api';

// Funciones de utilidad
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'message ' + type + ' show';
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 3000);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'confirmada': 'Confirmada',
        'cancelada': 'Cancelada',
        'completada': 'Completada',
        'en_curso': 'En Curso',
        'no_asistio': 'No Asistió'
    };
    return estados[estado] || estado;
}

// Autenticación
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        cedula: formData.get('cedula'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(API_BASE + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Login exitoso', 'success');
            
            // Guardar información del usuario
            localStorage.setItem('user_name', result.nombre);
            localStorage.setItem('user_rol', result.rol);
            
            // Redirigir según el rol
            setTimeout(() => {
                if (result.rol === 'paciente') {
                    window.location.href = 'paciente/index.html';
                } else if (result.rol === 'medico') {
                    window.location.href = 'medico/index.html';
                } else if (result.rol === 'admin') {
                    window.location.href = 'admin/index.html';
                } else {
                    window.location.href = 'paciente/index.html';
                }
            }, 1500);
        } else {
            showMessage(result.message || 'Error en el login', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        cedula: formData.get('cedula'),
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        password: formData.get('password'),
        rol: formData.get('rol')
    };
    
    // Validaciones básicas
    if (!data.cedula || !data.nombre || !data.email || !data.password) {
        showMessage('Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (data.password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showMessage('El email no tiene un formato válido', 'error');
        return;
    }
    
    if (!isValidCedula(data.cedula)) {
        showMessage('La cédula debe contener solo números y tener al menos 6 dígitos', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Registro exitoso. Puedes iniciar sesión.', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(result.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    }
}

async function logout() {
    try {
        await fetch(API_BASE + '/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error en logout:', error);
    }
    
    // Limpiar datos locales
    localStorage.clear();
    
    // Redirigir al login
    const currentPath = window.location.pathname;
    if (currentPath.includes('paciente/')) {
        window.location.href = '../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Verificación de autenticación
function checkAuth() {
    const userName = localStorage.getItem('user_name');
    const userRol = localStorage.getItem('user_rol');
    
    if (!userName || !userRol) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('paciente/')) {
            window.location.href = '../index.html';
        } else if (!currentPath.includes('index.html') && !currentPath.includes('registro.html')) {
            window.location.href = 'index.html';
        }
        return false;
    }
    return true;
}

function loadUserInfo() {
    const userName = localStorage.getItem('user_name');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
}

// Funciones específicas de paciente
async function loadMedicos() {
    const especialidadSelect = document.getElementById('especialidad');
    const medicoSelect = document.getElementById('medico');
    
    if (!especialidadSelect || !medicoSelect) {
        console.error('No se encontraron los elementos select');
        return;
    }
    
    const especialidad = especialidadSelect.value;
    
    if (!especialidad) {
        medicoSelect.innerHTML = '<option value="">Seleccionar especialidad primero</option>';
        return;
    }
    
    medicoSelect.innerHTML = '<option value="">Cargando médicos...</option>';
    
    try {
        const response = await fetch(API_BASE + '/paciente/medicos/' + especialidad, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success && result.medicos) {
            medicoSelect.innerHTML = '<option value="">Seleccionar médico</option>';
            result.medicos.forEach(medico => {
                const option = document.createElement('option');
                option.value = medico.cedula;
                option.textContent = medico.nombre;
                medicoSelect.appendChild(option);
            });
        } else {
            showMessage('Error cargando médicos', 'error');
            medicoSelect.innerHTML = '<option value="">Error cargando médicos</option>';
        }
    } catch (error) {
        console.error('Error cargando médicos:', error);
        showMessage('Error de conexión al cargar médicos', 'error');
        medicoSelect.innerHTML = '<option value="">Error de conexión</option>';
    }
}

async function handleAgendarCita(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        especialidad: formData.get('especialidad'),
        medico: formData.get('medico'),
        fecha: formData.get('fecha'),
        motivo: formData.get('motivo')
    };
    
    // Validaciones
    if (!data.especialidad || !data.medico || !data.fecha || !data.motivo) {
        showMessage('Todos los campos son obligatorios', 'error');
        return;
    }
    
    // Validar que la fecha sea futura
    const fechaCita = new Date(data.fecha);
    const ahora = new Date();
    if (fechaCita <= ahora) {
        showMessage('La fecha debe ser futura', 'error');
        return;
    }
    
    // Validar que el motivo tenga contenido
    if (data.motivo.trim().length < 10) {
        showMessage('El motivo debe tener al menos 10 caracteres', 'error');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/paciente/agendar-cita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Cita agendada exitosamente', 'success');
            setTimeout(() => {
                window.location.href = 'historial-citas.html';
            }, 2000);
        } else {
            showMessage(result.message || 'Error agendando cita', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión al agendar cita', 'error');
    }
}

async function loadHistorial() {
    const tbody = document.getElementById('historialBody');
    if (!tbody) {
        console.error('No se encontró el elemento historialBody');
        return;
    }
    
    // Mostrar loading
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando...</td></tr>';
    
    try {
        const response = await fetch(API_BASE + '/paciente/historial-citas', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        const result = await response.json();
        
        if (result.success) {
            if (!result.citas || result.citas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay citas registradas</td></tr>';
                return;
            }
            
            tbody.innerHTML = result.citas.map(cita => {
                const estadoSpan = '<span class="estado-' + cita.estado + '">' + formatEstado(cita.estado) + '</span>';
                const btnCancelar = cita.estado === 'pendiente' ? 
                    '<button onclick="cancelarCita(' + cita.id + ')" class="btn-secondary" style="background: #dc3545; margin-left: 5px;">Cancelar</button>' : '';
                
                return '<tr>' +
                    '<td>' + formatDate(cita.fecha) + '</td>' +
                    '<td>' + (cita.medico_nombre || 'N/A') + '</td>' +
                    '<td>' + (cita.especialidad_nombre || 'N/A') + '</td>' +
                    '<td>' + estadoSpan + '</td>' +
                    '<td>' + (cita.diagnostico || '-') + '</td>' +
                    '<td>' +
                        '<button onclick="verDetallesCita(' + cita.id + ')" class="btn-secondary">Ver</button>' +
                        btnCancelar +
                    '</td>' +
                '</tr>';
            }).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error: ' + (result.message || 'No se pudieron cargar las citas') + '</td></tr>';
            showMessage(result.message || 'Error cargando historial', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error de conexión</td></tr>';
        showMessage('Error de conexión al cargar historial', 'error');
    }
}

async function cancelarCita(citaId) {
    if (!citaId || isNaN(citaId)) {
        showMessage('ID de cita inválido', 'error');
        return;
    }
    
    if (!confirm('¿Está seguro que desea cancelar esta cita?')) {
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/paciente/cancelar-cita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ cita_id: parseInt(citaId) })
        });
        
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Cita cancelada exitosamente', 'success');
            loadHistorial(); // Recargar la tabla
        } else {
            showMessage(result.message || 'Error cancelando cita', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión al cancelar cita', 'error');
    }
}

function verDetallesCita(citaId) {
    if (!citaId || isNaN(citaId)) {
        showMessage('ID de cita inválido', 'error');
        return;
    }
    
    // Por ahora mostrar alert, luego se puede implementar modal
    alert('Ver detalles de la cita ' + citaId + ' (funcionalidad pendiente de implementar)');
    
    // TODO: Implementar modal con detalles completos de la cita
    // mostrarModalCita(citaId);
}

// Configurar fecha mínima en el input de fecha
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Configurar input de fecha
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        setupDateInput(fechaInput);
    }
    
    // Auto-cargar información del usuario
    loadUserInfo();
    
    // Configurar eventos específicos de la página
    setupPageEvents();
}

function setupDateInput(fechaInput) {
    const now = new Date();
    // Ajustar zona horaria
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // Establecer fecha mínima como mañana
    now.setDate(now.getDate() + 1);
    fechaInput.min = now.toISOString().slice(0, 16);
    
    // Establecer valor por defecto (mañana a las 9:00)
    const tomorrow = new Date(now);
    tomorrow.setHours(9, 0, 0, 0);
    fechaInput.value = tomorrow.toISOString().slice(0, 16);
}

function setupPageEvents() {
    // Configurar evento de cambio de especialidad
    const especialidadSelect = document.getElementById('especialidad');
    if (especialidadSelect) {
        especialidadSelect.addEventListener('change', loadMedicos);
    }
    
    // Configurar formulario de agendar cita
    const agendarForm = document.getElementById('agendarForm');
    if (agendarForm) {
        agendarForm.addEventListener('submit', handleAgendarCita);
    }
    
    // Configurar formularios de autenticación
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Función auxiliar para manejar errores de red
function handleNetworkError(error) {
    console.error('Network error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showMessage('No se puede conectar al servidor. Verifica que esté funcionando.', 'error');
    } else {
        showMessage('Error de conexión inesperado', 'error');
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar cédula (solo números)
function isValidCedula(cedula) {
    const cedulaRegex = /^\d+$/;
    return cedulaRegex.test(cedula) && cedula.length >= 6;
}
