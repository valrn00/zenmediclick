import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => navigate('/login');
  const redirectToRegister = () => navigate('/register');

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Zenmediclick</div>
        <nav className="nav-links">
          {/* Usamos Link para la navegación en React */}
          <Link to="/login">Iniciar Sesion</Link>
          <Link to="/register">Registrarse</Link>
        </nav>
      </header>
      
      <main className="main-content">
        <h1 className="main-title">Tu salud, nuestra<br/>prioridad</h1>
        <p className="description">
          Bienvenidos a Zenmediclick. Agendar tus citas medicas ahora es mas rápido, fácil y personalizado. ¡Tu bienestar esta a tu clic de distancia!
        </p>
        <div className="button-group">
          {/* Usamos useNavigate en lugar de onclick con window.location */}
          <button className="btn btn-primary" onClick={redirectToLogin}>
            Iniciar sesion
          </button>
          <button className="btn btn-secondary" onClick={redirectToRegister}>
            Registrarse
          </button>
        </div>
        
        {/* Mantenemos el HTML para el loto, asumiendo que el CSS lo estiliza */}
        <div className="logo-decoration">
          <div className="lotus-icon">
            <div className="petals">
              <div className="petal"></div>
              <div className="petal"></div>
              <div className="petal"></div>
              <div className="petal"></div>
              <div className="petal"></div>
              <div className="petal"></div>
            </div>
          </div>
          <div className="zen-text">ZENMEDICLICK</div>
        </div>
      </main>
      
      <footer className="footer">
        2025 Zenmediclick. Todos los derechos estan reservados
      </footer>
    </div>
  );
};

export default Home;