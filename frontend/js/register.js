document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value.trim();
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const role = document.getElementById('register-role').value;
            
            // Validación de campos vacíos
            if (!name || !username || !password || !role) {
                showMessage('register-message', 'Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Verificar si el usuario ya existe
            const users = getUsers();
            if (users.some(user => user.username === username)) {
                showMessage('register-message', 'El nombre de usuario ya existe', 'error');
                return;
            }
            
            // Crear nuevo usuario
            const newUser = {
                name: name,
                username: username,
                password: password,
                role: role
            };
            
            addUser(newUser);
            showMessage('register-message', 'Usuario registrado exitosamente', 'success');
            
            // Limpiar formulario
            registerForm.reset();
            
            // Redirigir a login después de un momento
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
});