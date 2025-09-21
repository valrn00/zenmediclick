import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardMedico from "./pages/DashboardMedico";
import DashboardPaciente from "./pages/DashboardPaciente";
import DashboardGeneral from "./pages/DashboardGeneral";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/" element={<Login />} />

        {/* RUTAS PROTEGIDAS POR ROL */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["Administrador"]}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/medico"
          element={
            <PrivateRoute roles={["Medico"]}>
              <DashboardMedico />
            </PrivateRoute>
          }
        />

        <Route
          path="/paciente"
          element={
            <PrivateRoute roles={["Paciente"]}>
              <DashboardPaciente />
            </PrivateRoute>
          }
        />

        {/* Ruta accesible para todos los roles */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["Administrador", "Medico", "Paciente"]}>
              <DashboardGeneral />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
