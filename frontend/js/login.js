document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            
            // Validación de campos vacíos
            if (!username || !password) {
                showMessage('login-message', 'Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Buscar usuario
            const user = findUser(username, password);
            if (user) {
                setLoggedUser(user);
                // Redirigir según el rol
               if (user.role === 'admin') {
               window.location.href = 'admin.html';
               } else if (user.role === 'medico') {
               window.location.href = 'medico.html';
               } else if (user.role === 'paciente') {
               window.location.href = 'paciente.html';
            }
            } else {
                showMessage('login-message', 'Usuario o contraseña incorrectos', 'error');
            }
        });
    }
});