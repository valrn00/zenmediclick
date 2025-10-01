import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { MedicoProvider, useMedico } from '../../zenmediclick-medico/sistema-citas-medicas/MedicoContext.jsx';
import Agenda from 'Agenda.jsx';
import Detalles from 'Detalles.jsx';
import Observaciones from '/Observaciones.jsx';
import CancelarCitas from 'CancelarCitas.jsx';

const Dashboard = () => {
  const { medico, loading, showMessage } = useMedico();

  useEffect(() => {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });

    const interval = setInterval(() => {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const current = parseInt(stat.textContent);
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        if (current + change >= 0) {
          stat.textContent = current + change;
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      localStorage.removeItem('authToken');
      window.location.href = 'login.html';
    }
  };

  const showCancelModal = () => {
    showMessage('Redirigiendo a la página de cancelación de citas...', 'info');
    setTimeout(() => {
      window.location.href = '/cancelar-citas';
    }, 1000);
  };

  if (loading) {
    return <div className="text-center text-white p-10">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-sans">
      <header className="flex justify-between items-center p-5 md:p-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-4 text-2xl font-bold">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] rounded-full flex items-center justify-center text-xl">🏥</div>
          <span>ZenMediClick</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 p-2 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-transform hover:-translate-y-0.5">
            <span>Dr. {medico?.nombre || 'Usuario'}</span>
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">👨‍⚕️</div>
          </div>
          <button
            className="px-5 py-2 bg-white/20 border border-white/30 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="flex justify-center gap-4 p-5">
        <Link to="/" className="px-5 py-2 bg-white/40 rounded-full text-white hover:bg-white/50 hover:-translate-y-0.5 transition-all">Inicio</Link>
        <Link to="/agenda" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Agenda</Link>
        <Link to="/detalles" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Detalles</Link>
        <Link to="/observaciones" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Observaciones</Link>
        <Link to="/cancelar-citas" className="px-5 py-2 bg-white/20 rounded-full text-white hover:bg-white/30 hover:-translate-y-0.5 transition-all">Cancelar Citas</Link>
      </nav>

      <main className="p-8 md:p-16 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-10 md:mb-16 text-shadow-md">Bienvenido, Dr. {medico?.nombre || 'Usuario'}</h1>

        <div className="flex flex-wrap justify-center gap-10 mb-10">
          <div className="bg-white/10 p-5 md:p-7 rounded-xl backdrop-blur-md text-center min-w-[150px]">
            <div className="stat-number text-3xl font-bold mb-1">8</div>
            <div className="stat-label text-sm opacity-90">Citas Hoy</div>
          </div>
          <div className="bg-white/10 p-5 md:p-7 rounded-xl backdrop-blur-md text-center min-w-[150px]">
            <div className="stat-number text-3xl font-bold mb-1">3</div>
            <div className="stat-label text-sm opacity-90">Pendientes</div>
          </div>
          <div className="bg-white/10 p-5 md:p-7 rounded-xl backdrop-blur-md text-center min-w-[150px]">
            <div className="stat-number text-3xl font-bold mb-1">24</div>
            <div className="stat-label text-sm opacity-90">Esta Semana</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Link to="/agenda" className="dashboard-card bg-white/95 text-gray-800 p-8 md:p-10 rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center text-white text-2xl mb-5">📅</div>
            <h3 className="text-2xl font-semibold mb-2">Agendar Cita</h3>
            <p className="text-gray-600">Programa una nueva cita médica</p>
          </Link>
          <Link to="/detalles" className="dashboard-card bg-white/95 text-gray-800 p-8 md:p-10 rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center text-white text-2xl mb-5">📋</div>
            <h3 className="text-2xl font-semibold mb-2">Historial de Citas</h3>
            <p className="text-gray-600">Ver todas tus citas anteriores</p>
          </Link>
          <Link to="/cancelar-citas" className="dashboard-card bg-white/95 text-gray-800 p-8 md:p-10 rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all" onClick={showCancelModal}>
            <div className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center text-white text-2xl mb-5">❌</div>
            <h3 className="text-2xl font-semibold mb-2">Cancelar Cita</h3>
            <p className="text-gray-600">Cancelar citas programadas</p>
          </Link>
          <Link to="/observaciones" className="dashboard-card bg-white/95 text-gray-800 p-8 md:p-10 rounded-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center text-white text-2xl mb-5">🔔</div>
            <h3 className="text-2xl font-semibold mb-2">Observaciones</h3>
            <p className="text-gray-600">Configurar notificaciones</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <MedicoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/detalles" element={<Detalles />} />
          <Route path="/observaciones" element={<Observaciones />} />
          <Route path="/cancelar-citas" element={<CancelarCitas />} />
        </Routes>
      </BrowserRouter>
    </MedicoProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
