// Funciones para manejo de usuarios en localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function addUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function findUser(username, password) {
    const users = getUsers();
    return users.find(user => user.username === username && user.password === password);
}

// Funciones para manejo de sesión
function setLoggedUser(user) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
}

function getLoggedUser() {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
}

// Función para mostrar mensajes
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 3000);
}