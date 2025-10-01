import { BrowserRouter, Routes, Route } from "react-router-dom";
import PacienteRoutes from "./modules/paciente/routes/PacienteRoutes";
import AdminRoutes from "./modules/admin/routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/paciente/*" element={<PacienteRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
