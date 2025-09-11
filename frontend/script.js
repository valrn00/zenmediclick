document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita refrescar la página

    const nombre = document.getElementById("nombre").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const cedula = document.getElementById("cedula").value.trim();
    const rol = document.getElementById("rol").value;

    if (!nombre || !contrasena || !cedula || !rol) {
      alert("⚠️ Todos los campos son obligatorios");
      return;
    }

    if (contrasena.length < 6) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!/^\d+$/.test(cedula)) {
      alert("⚠️ La cédula debe contener solo números");
      return;
    }

    // Simulación de registro exitoso
    alert(`✅ Usuario ${nombre} registrado con rol ${rol}`);
    
    // Aquí podrías enviar los datos a un backend con fetch()
    // fetch('/api/registro', { method: 'POST', body: JSON.stringify({nombre, contrasena, cedula, rol}) })
  });
});
