// Ubicación: src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // Estilos específicos de Register.html

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Eliminamos confirmPassword del body que enviamos a la API
        body: JSON.stringify({ firstName, lastName, email, phone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert("⚠️ Error: " + (data.error || "Hubo un error al registrar."));
      } else {
        alert("✅ Usuario creado con éxito");
        // **Redirección al Login (Cumple tu Condición)**
        navigate('/login'); 
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container">
      {/* Usamos Link para el botón "Volver" */}
      <Link to="/" className="back-button">← Volver</Link>
      
      <div className="form-container">
        <h2 className="form-title">Crear Cuenta</h2>
        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre:</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellido:</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono:</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }}>
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;