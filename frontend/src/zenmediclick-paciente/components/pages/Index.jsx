// src/modules/paciente/pages/Index.jsx
import { Link } from "react-router-dom";

export default function IndexPaciente() {
  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">🌸</div>
              <h1 className="brand-name">ZenMediClick</h1>
            </div>
            <div className="user-section">
              <span className="user-name">Usuario</span>
              <button className="logout-btn">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <h2 className="welcome-title">Bienvenido, Paciente</h2>

          <div className="menu-options">
            <Link to="agendar" className="menu-card schedule">
              <span className="menu-icon">📅</span>
              <h3 className="menu-title">Agendar Cita</h3>
              <p className="menu-description">Programa una nueva cita médica</p>
            </Link>

            <Link to="historial" className="menu-card history">
              <span className="menu-icon">📋</span>
              <h3 className="menu-title">Historial de Citas</h3>
              <p className="menu-description">Ver todas tus citas anteriores</p>
            </Link>

            <Link to="cancelar" className="menu-card cancel">
              <span className="menu-icon">❌</span>
              <h3 className="menu-title">Cancelar Cita</h3>
              <p className="menu-description">Cancelar citas programadas</p>
            </Link>

            <Link to="recordatorios" className="menu-card reminders">
              <span className="menu-icon">🔔</span>
              <h3 className="menu-title">Recordatorios</h3>
              <p className="menu-description">Configurar notificaciones</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
