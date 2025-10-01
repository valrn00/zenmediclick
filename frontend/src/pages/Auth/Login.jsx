// Ubicación: src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Importa los estilos de Login.html

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función de manejo de envío, reemplaza el script de login.html
  const handleLogin = async (e) => {
    e.preventDefault();

    // NOTA: El campo userType no existe en el HTML que me pasaste,
    // pero es necesario para la lógica de redirección.
    // Asumiré que el rol viene del backend después del login, o que lo añades al formulario.
    // Si lo añades, descomenta la línea de abajo y el <select> en el return.
    // const userType = document.getElementById("userType").value;

    try {
      // Reemplaza el 'userType' en el body si no lo estás pidiendo en el formulario.
      // Si el backend es quien decide el rol, se elimina del body.
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) 
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Bienvenido " + (data.nombre || 'Usuario'));
        
        // **Lógica de Redirección por Rol (Cumple tu Condición)**
        const userRole = data.userType; // Asumiendo que el backend devuelve el rol
        
        if (userRole === "medico") {
          navigate('/medico'); // Redirige al módulo Médico
        } else if (userRole === "paciente") {
          navigate('/paciente'); // Redirige al módulo Paciente
        } else if (userRole === "admin") {
          navigate('/admin'); // Redirige al módulo Admin
        } else {
            navigate('/default-dashboard'); // Ruta por defecto
        }
      } else {
        alert("❌ Error: " + (data.detail || "Credenciales inválidas"));
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("⚠️ No se pudo conectar con el servidor.");
    }
  };

  return (
    // La clase `body` del CSS se debe mover al `Login.css` para este componente.
    <div className="login-page-wrapper"> 
      <div className="login-container">
        <h1>ZenMediClick</h1>
        <p className="subtitle">Plataforma médica segura y confiable</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="tu-email@ejemplo.com" 
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Tu contraseña" 
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="login-links">
          {/* Link para Recuperación de Contraseña */}
          <Link to="/auth/password-recovery">🔑 ¿Olvidaste tu contraseña?</Link>
          {/* Link para Registrarse */}
          <Link to="/register">📝 Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;