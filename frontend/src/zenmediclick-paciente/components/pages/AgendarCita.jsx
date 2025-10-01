import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AgendarCita() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    especialidad: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Datos de la cita:", formData);
    alert("Cita agendada exitosamente");

    // Redirigir al dashboard del paciente
    navigate("/paciente");
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      {/* Header con botón de regreso */}
      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        }}
      >
        <Link
          to="/paciente"
          className="back-button"
          style={{
            color: "#667eea",
            textDecoration: "none",
            fontWeight: "bold",
            padding: "10px 20px",
            background: "rgba(102, 126, 234, 0.1)",
            borderRadius: "8px",
            transition: "all 0.3s ease",
          }}
        >
          ← Regresar al Dashboard
        </Link>
        <h1>Agendar Nueva Cita</h1>
      </div>

      {/* Formulario */}
      <div
        className="form-container"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* ESPECIALIDAD */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="especialidad"
              style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}
            >
              Especialidad:
            </label>
            <select
              id="especialidad"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              <option value="">Seleccionar especialidad</option>
              <option value="cardiologia">Cardiología</option>
              <option value="dermatologia">Dermatología</option>
              <option value="medicina_general">Medicina General</option>
              <option value="pediatria">Pediatría</option>
            </select>
          </div>

          {/* FECHA */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="fecha"
              style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}
            >
              Fecha:
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          </div>

          {/* HORA */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="hora"
              style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}
            >
              Hora:
            </label>
            <select
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              <option value="">Seleccionar hora</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>

          {/* MOTIVO */}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="motivo"
              style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}
            >
              Motivo de la consulta:
            </label>
            <input
              type="text"
              id="motivo"
              name="motivo"
              placeholder="Describe brevemente el motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              padding: "15px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Agendar Cita
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgendarCita;
