/**
 * ZENMEDICLICK - GESTIÓN DE USUARIOS
 * Funciones para administrar usuarios del sistema
 */

// Variables y funciones globales necesarias para evitar errores
const users = window.users || []; // Si existe en window, úsalo, si no, crea uno vacío

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function showMessage(message) {
    // Simple alert, reemplazar por lógica real si existe
    alert(message);
}

function logAuditAction(action, user, details) {
    // Simulación de log de auditoría
    console.log(`[AUDIT] Acción: ${action}, Usuario: ${user}, Detalles:`, details || {});
}

function validateEmail(email) {
    // Validación simple de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRoleColor(role) {
    // Devuelve color según el rol
    switch (role) {
        case 'admin': return '#007bff';
        case 'medico': return '#28a745';
        case 'asistente': return '#ffc107';
        default: return '#6c757d';
    }
}

function getRoleText(role) {
    switch (role) {
        case 'admin': return 'Administrador';
        case 'medico': return 'Médico';
        case 'asistente': return 'Asistente';
        default: return role;
    }
}

// Exportar funciones usadas en HTML al objeto global para evitar advertencias de "unused"
window.showAddUserModal = showAddUserModal;
window.saveNewUser = saveNewUser;
window.editUser = editUser;
window.activateUser = activateUser;
window.deactivateUser = deactivateUser;

// ==========================================
// GESTIÓN DE USUARIOS - FUNCIONES PRINCIPALES
// ==========================================

/**
 * Mostrar modal para agregar usuario
 */
function showAddUserModal() {
    openModal('addUserModal');
    logAuditAction('VIEW_ADD_USER_MODAL', 'system');
}

/**
 * Guardar nuevo usuario
 */
function saveNewUser() {
    const formData = collectNewUserFormData();
    
    // Validar datos del formulario
    const validation = validateUserData(formData);
    if (!validation.isValid) {
        showMessage(`❌ ${validation.message}`, 'error');
        return;
    }

    // Verificar email único
    if (users.find(user => user.email === formData.email)) {
        showMessage('❌ Ya existe un usuario con este email', 'error');
        return;
    }

    // Crear nuevo usuario
    const newUser = createUserObject(formData);
    users.push(newUser);
    
    // Actualizar interfaz
    updateUsersTable();
    closeModal('addUserModal');
    showMessage(`✅ Usuario ${formData.name} creado exitosamente`, 'success');
    
    // Log de auditoría
    logAuditAction('CREATE_USER', formData.email, {
        name: formData.name,
        role: formData.role,
        specialty: formData.specialty
    });
}

/**
 * Recolectar datos del formulario
 * @returns {Object} Datos del formulario
 */
function collectNewUserFormData() {
    return {
        name: document.getElementById('newUserName').value.trim(),
        email: document.getElementById('newUserEmail').value.trim().toLowerCase(),
        phone: document.getElementById('newUserPhone').value.trim(),
        role: document.getElementById('newUserRole').value,
        password: document.getElementById('newUserPassword').value,
        specialty: document.getElementById('newUserSpecialty').value,
        license: document.getElementById('newUserLicense').value.trim()
    };
}

/**
 * Validar datos del usuario
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Resultado de la validación
 */
function validateUserData(formData) {
    if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.password) {
        return { isValid: false, message: 'Por favor completa todos los campos obligatorios' };
    }

    if (!validateEmail(formData.email)) {
        return { isValid: false, message: 'Por favor ingresa un email válido' };
    }

    if (formData.password.length < 6) {
        return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    if (formData.role === 'medico' && !formData.specialty) {
        return { isValid: false, message: 'Por favor selecciona una especialidad para el médico' };
    }

    return { isValid: true };
}

/**
 * Crear objeto usuario
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Nuevo objeto usuario
 */
function createUserObject(formData) {
    const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: 'active',
        password: formData.password, // En producción esto estaría cifrado
        createdAt: new Date().toISOString()
    };

    // Campos específicos para médicos
    if (formData.role === 'medico') {
        newUser.specialty = formData.specialty;
        newUser.license = formData.license;
    }

    return newUser;
}

// ==========================================
// ACTUALIZACIÓN DE TABLA DE USUARIOS
// ==========================================

/**
 * Actualizar tabla de usuarios
 */
function updateUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = createUserTableRow(user);
        tbody.appendChild(row);
    });
    
    console.log(`📊 Tabla de usuarios actualizada - ${users.length} usuarios`);
}

/**
 * Crear fila de la tabla de usuarios
 * @param {Object} user - Datos del usuario
 * @returns {HTMLElement} Fila de la tabla
 */
function createUserTableRow(user) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: ${getRoleColor(user.role).split(';')[0]}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style="font-weight: 600;">${user.name}</div>
                    <div style="font-size: 12px; color: #666;">${user.email}</div>
                </div>
            </div>
        </td>
        <td>
            <span class="status-badge" style="background: ${getRoleColor(user.role)};">
                ${getRoleText(user.role)}
            </span>
            ${user.specialty ? `<br><small style="color: #666;">📋 ${formatSpecialty(user.specialty)}</small>` : ''}
        </td>
        <td>
            <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">
                ${user.status === 'active' ? '✅ Activo' : '❌ Inactivo'}
            </span>
        </td>
        <td>
            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                <button class="btn btn-warning btn-small" onclick="editUser('${user.id}')">
                    ✏️ Editar
                </button>
                ${user.status === 'active' ? 
                    `<button class="btn btn-danger btn-small" onclick="deactivateUser('${user.id}')">⏸️ Desactivar</button>` :
                    `<button class="btn btn-success btn-small" onclick="activateUser('${user.id}')">✅ Activar</button>`
                }
            </div>
        </td>
    `;
    return row;
}

/**
 * Formatear especialidad médica
 * @param {string} specialty - Especialidad
 * @returns {string} Especialidad formateada
 */
function formatSpecialty(specialty) {
    const specialties = {
        'cardiologia': 'Cardiología',
        'pediatria': 'Pediatría',
        'neurologia': 'Neurología',
        'ginecologia': 'Ginecología',
        'traumatologia': 'Traumatología',
        'dermatologia': 'Dermatología'
    };
    return specialties[specialty] || specialty;
}

// ==========================================
// ACCIONES SOBRE USUARIOS
// ==========================================

/**
 * Editar usuario
 * @param {string} userId - ID del usuario
 */
function editUser(userId) {
    const user = users.find(u => u.id == userId);
    if (!user) {
        showMessage('❌ Usuario no encontrado', 'error');
        return;
    }
    
    showMessage(`🔄 Abriendo editor para ${user.name}...`, 'info');
    
    // Aquí implementarías la lógica para abrir modal de edición
    // Por ahora, simular la acción
    setTimeout(() => {
        showMessage(`✏️ Editor de ${user.name} (funcionalidad en desarrollo)`, 'info');
    }, 1000);
    
    logAuditAction('VIEW_EDIT_USER', user.email, { userName: user.name });
}

/**
 * Activar usuario
 * @param {string} userId - ID del usuario
 */
function activateUser(userId) {
    const user = users.find(u => u.id == userId);
    if (!user) {
        showMessage('❌ Usuario no encontrado', 'error');
        return;
    }
    
    user.status = 'active';
    updateUsersTable();
    showMessage(`✅ Usuario ${user.name} activado correctamente`, 'success');
    
    logAuditAction('ACTIVATE_USER', user.email, { userName: user.name });
}

/**
 * Desactivar usuario
 * @param {string} userId - ID del usuario
 */
function deactivateUser(userId) {
    const user = users.find(u => u.id == userId);
    if (!user) {
        showMessage('❌ Usuario no encontrado', 'error');
        return;
    }
    
    if (confirm(`¿Estás seguro de desactivar a ${user.name}?`)) {
        user.status = 'inactive';
        updateUsersTable();
        showMessage(`⏸️ Usuario ${user.name} desactivado correctamente`, 'success');
        
        logAuditAction('DEACTIVATE_USER', user.email, { userName: user.name });
    }
}

// ==========================================
// BÚSQUEDA DE USUARIOS
// ==========================================

/**
 * Buscar usuarios
 */
function searchUsers() {
    const searchTerm = document.getElementById('searchUser').value.toLowerCase().trim();
    
    if (!searchTerm) {
        updateUsersTable();
        return;
    }
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm) ||
        (user.specialty && user.specialty.toLowerCase().includes(searchTerm))
    );
    
    // Actualizar tabla con usuarios filtrados
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                    🔍 No se encontraron usuarios que coincidan con "${searchTerm}"
                </td>
            </tr>
        `;
    } else {
        filteredUsers.forEach(user => {
            const row = createUserTableRow(user);
            tbody.appendChild(row);
        });
    }
    
    showMessage(`🔍 ${filteredUsers.length} usuario(s) encontrado(s)`, 'info');
    logAuditAction('SEARCH_USERS', searchTerm);
}

// Event listener para búsqueda en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchUser');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchUsers, 300));
    }
});

/**
 * Debounce function para optimizar búsqueda
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera
 * @returns {Function} Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}