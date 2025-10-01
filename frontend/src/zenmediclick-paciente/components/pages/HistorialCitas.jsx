import React, { useState, useEffect } from "react";
import "./paciente.css";

const citasHistorialInicial = [
  {
    fecha: "2024-03-15",
    hora: "10:00",
    especialidad: "Cardiología",
    doctor: "Dr. García López",
    estado: "completada",
    motivo: "Chequeo rutinario",
  },
  {
    fecha: "2024-03-20",
    hora: "14:30",
    especialidad: "Dermatología",
    doctor: "Dra. Martínez Silva",
    estado: "confirmada",
    motivo: "Revisión de lunares",
  },
  {
    fecha: "2024-02-28",
    hora: "09:15",
    especialidad: "Medicina General",
    doctor: "Dr. Rodríguez Peña",
    estado: "completada",
    motivo: "Dolor de cabeza recurrente",
  },
  {
    fecha: "2024-02-10",
    hora: "16:00",
    especialidad: "Pediatría",
    doctor: "Dra. López Hernández",
    estado: "cancelada",
    motivo: "Vacunación",
  },
];

const HistorialCitas = () => {
  const [citasHistorial] = useState(citasHistorialInicial);
  const [citasFiltradas, setCitasFiltradas] = useState(citasHistorialInicial);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    setCitasFiltradas(citasHistorial);
  }, [citasHistorial]);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const aplicarFiltros = () => {
    const filtradas = citasHistorial.filter((cita) => {
      let cumple = true;

      if (
        filtroEspecialidad &&
        !cita.especialidad.toLowerCase().includes(filtroEspecialidad)
      )
        cumple = false;

      if (filtroEstado && cita.estado !== filtroEstado) cumple = false;

      if (filtroFecha && cita.fecha !== filtroFecha) cumple = false;

      return cumple;
    });

    setCitasFiltradas(filtradas);
  };

  const limpiarFiltros = () => {
    setFiltroEspecialidad("");
    setFiltroEstado("");
    setFiltroFecha("");
    setCitasFiltradas(citasHistorial);
  };

  const verDetalle = (fecha) => {
    const cita = citasHistorial.find((c) => c.fecha === fecha);
    alert(`Detalle de la cita:

Fecha: ${formatearFecha(cita.fecha)}
Hora: ${cita.hora}
Especialidad: ${cita.especialidad}
Doctor: ${cita.doctor}
Estado: ${capitalizar(cita.estado)}
Motivo: ${cita.motivo}`);
  };

  return (
    <div className="container">
      <div className="page-header">
        <a href="index.html" className="back-button">
          ← Regresar
        </a>
        <h1>Historial de Citas</h1>
      </div>

      <div className="filter-section">
        <label>Filtrar por:</label>
        <select
          value={filtroEspecialidad}
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
        >
          <option value="">Todas las especialidades</option>
          <option value="cardiologia">Cardiología</option>
          <option value="dermatologia">Dermatología</option>
          <option value="medicina_general">Medicina General</option>
          <option value="pediatria">Pediatría</option>
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="confirmada">Confirmada</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
          <option value="pendiente">Pendiente</option>
        </select>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <button className="btn-filter" onClick={aplicarFiltros}>
          Filtrar
        </button>
        <button className="btn-filter" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      <div className="table-container">
        {citasFiltradas.length === 0 ? (
          <div className="empty-message">
            No hay citas registradas en tu historial.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Especialidad</th>
                <th>Doctor</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita, index) => (
                <tr key={index}>
                  <td>{formatearFecha(cita.fecha)}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.especialidad}</td>
                  <td>{cita.doctor}</td>
                  <td>
                    <span className={`estado-${cita.estado}`}>
                      {capitalizar(cita.estado)}
                    </span>
                  </td>
                  <td>{cita.motivo}</td>
                  <td>
                    <button
                      onClick={() => verDetalle(cita.fecha)}
                      style={{
                        background: "#17a2b8",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistorialCitas;
