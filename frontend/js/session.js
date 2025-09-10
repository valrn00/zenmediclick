// Verificar si hay sesión activa
function checkSession() {
    const loggedUser = getLoggedUser();
    if (loggedUser) {
        if (loggedUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else if (loggedUser.role === 'medico') {
            window.location.href = 'medico.html';
        } else if (loggedUser.role === 'paciente') {
            window.location.href = 'paciente.html';
        }
        return true;
    }
    return false;
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
}

// Validar acceso a dashboards
function validateDashboardAccess() {
    const loggedUser = getLoggedUser();
    if (!loggedUser) {
        window.location.href = 'login.html';
        return false;
    }
    return loggedUser;
}

// Inicializar dashboards
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin.html') {
        const user = validateDashboardAccess();
        if (user && user.role === 'admin') {
            document.getElementById('admin-welcome').textContent = `¡Bienvenido, ${user.name}!`;
            const logoutBtn = document.getElementById('admin-logout');
            if (logoutBtn) logoutBtn.addEventListener('click', logout);
        } else if (user) {
            if (user.role === 'medico') window.location.href = 'medico.html';
            else if (user.role === 'paciente') window.location.href = 'paciente.html';
        }
    } else if (currentPage === 'medico.html') {
        const user = validateDashboardAccess();
        if (user && user.role === 'medico') {
            document.getElementById('medico-welcome').textContent = `¡Bienvenido, Dr. ${user.name}!`;
            const logoutBtn = document.getElementById('medico-logout');
            if (logoutBtn) logoutBtn.addEventListener('click', logout);
        } else if (user) {
            if (user.role === 'admin') window.location.href = 'admin.html';
            else if (user.role === 'paciente') window.location.href = 'paciente.html';
        }
    } else if (currentPage === 'paciente.html') {
        const user = validateDashboardAccess();
        if (user && user.role === 'paciente') {
            document.getElementById('paciente-welcome').textContent = `¡Bienvenido, ${user.name}!`;
            const logoutBtn = document.getElementById('paciente-logout');
            if (logoutBtn) logoutBtn.addEventListener('click', logout);
        } else if (user) {
            if (user.role === 'admin') window.location.href = 'admin.html';
            else if (user.role === 'medico') window.location.href = 'medico.html';
        }
    }
    
    if (currentPage === 'login.html' || currentPage === 'home.html') {
        checkSession();
    }
});