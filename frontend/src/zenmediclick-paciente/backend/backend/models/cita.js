import db from "../database.js";

class Cita {
  constructor(id, paciente_cedula, medico_cedula, especialidad_id, fecha, motivo, estado = "pendiente", diagnostico = null, medico_nombre = null, especialidad_nombre = null) {
    this.id = id;
    this.paciente_cedula = paciente_cedula;
    this.medico_cedula = medico_cedula;
    this.especialidad_id = especialidad_id;
    this.fecha = fecha;
    this.motivo = motivo;
    this.estado = estado;
    this.diagnostico = diagnostico;
    this.medico_nombre = medico_nombre;
    this.especialidad_nombre = especialidad_nombre;
  }

  static async crear({ paciente_cedula, medico_cedula, especialidad_id, fecha, motivo }) {
    const sql = "INSERT INTO citas (paciente_cedula, medico_cedula, especialidad_id, fecha, motivo) VALUES (?, ?, ?, ?, ?)";
    return new Promise((resolve) => {
      db.query(sql, [paciente_cedula, medico_cedula, especialidad_id, fecha, motivo], (err, result) => {
        if (err) {
          console.error("Error creando cita:", err);
          return resolve(null);
        }
        resolve(new Cita(result.insertId, paciente_cedula, medico_cedula, especialidad_id, fecha, motivo));
      });
    });
  }

  async cancelar() {
    const sql = "UPDATE citas SET estado = 'cancelada' WHERE id = ?";
    return new Promise((resolve) => {
      db.query(sql, [this.id], (err) => {
        if (err) {
          console.error("Error cancelando cita:", err);
          return resolve(false);
        }
        this.estado = "cancelada";
        resolve(true);
      });
    });
  }

  static async obtenerPorPaciente(paciente_cedula) {
    const sql = `SELECT c.*, u.nombre as medico_nombre, e.nombre as especialidad_nombre FROM citas c JOIN usuarios u ON c.medico_cedula = u.cedula JOIN especialidades e ON c.especialidad_id = e.id WHERE c.paciente_cedula = ? ORDER BY c.fecha DESC`;
    return new Promise((resolve) => {
      db.query(sql, [paciente_cedula], (err, results) => {
        if (err) return resolve([]);
        resolve(results.map(c => new Cita(c.id, c.paciente_cedula, c.medico_cedula, c.especialidad_id, c.fecha, c.motivo, c.estado, c.diagnostico, c.medico_nombre, c.especialidad_nombre)));
      });
    });
  }

  static async obtenerPorId(cita_id) {
    const sql = "SELECT * FROM citas WHERE id = ?";
    return new Promise((resolve) => {
      db.query(sql, [cita_id], (err, results) => {
        if (err || results.length === 0) return resolve(null);
        const c = results[0];
        resolve(new Cita(c.id, c.paciente_cedula, c.medico_cedula, c.especialidad_id, c.fecha, c.motivo, c.estado, c.diagnostico));
      });
    });
  }
}

export default Cita;
