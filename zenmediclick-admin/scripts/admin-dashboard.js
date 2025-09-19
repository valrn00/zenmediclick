/**
 * ZENMEDICLICK - PANEL DE ADMINISTRACIÓN
 * Funciones principales del dashboard
 */

// ==========================================
// VARIABLES GLOBALES
// ==========================================

// Base de datos simulada
window.users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'medico', status: 'active', specialty: 'cardiologia' },
    { id: 2, name: 'Ana Torres', email: 'ana@ejemplo.com', role: 'paciente', status: 'inactive' },
    { id: 3, name: 'Dr. Carlos Rodríguez', email: 'carlos@ejemplo.com', role: 'medico', status: 'active', specialty: 'cardiologia' },
    { id: 4, name: 'María González', email: 'maria@ejemplo.com', role: 'paciente', status: 'active' }
];

window.doctorSchedules = {};

// ==========================================
// FUNCIONES PRINCIPALES DEL DASHBOARD
// ==========================================

/**
 * Inicializar el dashboard
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard Admin inicializado');
    updateUsersTable();
    setupEventListeners();
});

/**
 * Renderizar la tabla de usuarios
 */
function updateUsersTable() {
    // Implementación mínima para evitar error
    const table = document.getElementById('usersTable');
    if (!table) return;
    table.innerHTML = '';
    window.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.status}</td>`;
        table.appendChild(row);
    });
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Event listener para mostrar campos específicos de médicos
    const roleSelect = document.getElementById('newUserRole');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const doctorFields = document.getElementById('doctorFields');
            if (this.value === 'medico') {
                doctorFields.style.display = 'block';
            } else {
                doctorFields.style.display = 'none';
            }
        });
    }

    // Cerrar modales con click fuera del contenido
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Esc para cerrar modales
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// ==========================================
// GESTIÓN DE MENSAJES
// ==========================================

/**
 * Mostrar mensaje de estado
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (success, error, info)
 */
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.innerHTML = message;
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.animation = 'slideIn 0.3s ease-out';
    
    const container = document.getElementById('messageContainer');
    container.appendChild(messageDiv);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}

// ==========================================
// GESTIÓN DE MODALES
// ==========================================

/**
 * Abrir modal
 * @param {string} modalId - ID del modal a abrir
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

/**
 * Cerrar modal
 * @param {string} modalId - ID del modal a cerrar
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
        
        // Limpiar formularios si es necesario
        if (modalId === 'addUserModal') {
            document.getElementById('addUserForm').reset();
            document.getElementById('doctorFields').style.display = 'none';
        }
    }
}

// ==========================================
// NAVEGACIÓN
// ==========================================

/**
 * Ir al panel principal
 */
function goToMainPanel() {
    showMessage('🔄 Redirigiendo al panel principal...', 'info');
    // Aquí implementarías la lógica de navegación
}

// ==========================================

/**
 * Obtener color según el rol del usuario
 * @param {string} role - Rol del usuario
 * @returns {string} Color CSS para el rol
 */
function getRoleColor(role) {
    const colors = {
        'medico': '#e3f2fd; color: #1976d2',
        'paciente': '#f3e5f5; color: #7b1fa2',
        'admin': '#fff3e0; color: #f57c00'
    };
    return colors[role] || '#f5f5f5; color: #666';
}
window.getRoleColor = getRoleColor;

/**
 * Obtener texto del rol
 * @param {string} role - Rol del usuario
 * @returns {string} Texto legible del rol
 */
function getRoleText(role) {
    const roles = {
        'medico': 'Médico',
        'paciente': 'Paciente', 
        'admin': 'Administrador'
    };
    return roles[role] || role;
}
window.getRoleText = getRoleText;

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
window.validateEmail = validateEmail;

/**
 * Generar un ID único
 * @returns {string} ID único
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
window.generateUniqueId = generateUniqueId;

/**
 * Registrar acción de auditoría
 * @param {string} action - Acción realizada
 * @param {string} target - Objetivo de la acción
 * @param {object} details - Detalles adicionales
 */
function logAuditAction(action, target, details = {}) {
    const auditLog = {
        admin: 'admin@zenmediclick.com',
        action: action,
        target: target,
        details: details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    console.log('📋 AUDIT LOG:', auditLog);
    
    // En producción, esto se enviaría al servidor
    // await fetch('/api/audit-log', {
    //     method: 'POST',
    //     body: JSON.stringify(auditLog)
    // });
}
window.logAuditAction = logAuditAction;

// ==========================================
// ANIMACIONES CSS DINÁMICAS
// ==========================================

// Agregar estilos de animación dinámicamente
if (!document.getElementById('admin-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse-animation {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// EXPORTAR FUNCIONES GLOBALES
// ==========================================

// Hacer funciones disponibles globalmente
window.showMessage = showMessage;
window.openModal = openModal;
window.closeModal = closeModal;
window.goToMainPanel = goToMainPanel;