import db from "../database.js";

class Soporte {
  constructor(id, usuario_cedula, asunto, mensaje, estado = "abierto", fecha_creacion = null, respuesta = null, fecha_respuesta = null) {
    this.id = id;
    this.usuario_cedula = usuario_cedula;
    this.asunto = asunto;
    this.mensaje = mensaje;
    this.estado = estado;
    this.fecha_creacion = fecha_creacion;
    this.respuesta = respuesta;
    this.fecha_respuesta = fecha_respuesta;
  }

  static async crear({ usuario_cedula, asunto, mensaje }) {
    const sql = "INSERT INTO soporte (usuario_cedula, asunto, mensaje, estado, fecha_creacion) VALUES (?, ?, ?, 'abierto', NOW())";
    return new Promise((resolve) => {
      db.query(sql, [usuario_cedula, asunto, mensaje], (err, result) => {
        if (err) {
          console.error("Error creando ticket de soporte:", err);
          return resolve(null);
        }
        resolve(new Soporte(result.insertId, usuario_cedula, asunto, mensaje));
      });
    });
  }

  static async obtenerPorUsuario(usuario_cedula) {
    const sql = "SELECT * FROM soporte WHERE usuario_cedula = ? ORDER BY fecha_creacion DESC";
    return new Promise((resolve) => {
      db.query(sql, [usuario_cedula], (err, results) => {
        if (err) return resolve([]);
        resolve(results.map(t => new Soporte(t.id, t.usuario_cedula, t.asunto, t.mensaje, t.estado, t.fecha_creacion, t.respuesta, t.fecha_respuesta)));
      });
    });
  }

  static async obtenerPorId(ticket_id) {
    const sql = "SELECT * FROM soporte WHERE id = ?";
    return new Promise((resolve) => {
      db.query(sql, [ticket_id], (err, results) => {
        if (err || results.length === 0) return resolve(null);
        const t = results[0];
        resolve(new Soporte(t.id, t.usuario_cedula, t.asunto, t.mensaje, t.estado, t.fecha_creacion, t.respuesta, t.fecha_respuesta));
      });
    });
  }

  async actualizarEstado(nuevo_estado) {
    const sql = "UPDATE soporte SET estado = ? WHERE id = ?";
    return new Promise((resolve) => {
      db.query(sql, [nuevo_estado, this.id], (err) => {
        if (err) {
          console.error("Error actualizando estado:", err);
          return resolve(false);
        }
        this.estado = nuevo_estado;
        resolve(true);
      });
    });
  }

  async agregarRespuesta(respuesta) {
    const sql = "UPDATE soporte SET respuesta = ?, fecha_respuesta = NOW(), estado = 'cerrado' WHERE id = ?";
    return new Promise((resolve) => {
      db.query(sql, [respuesta, this.id], (err) => {
        if (err) {
          console.error("Error agregando respuesta:", err);
          return resolve(false);
        }
        this.respuesta = respuesta;
        this.fecha_respuesta = new Date();
        this.estado = "cerrado";
        resolve(true);
      });
    });
  }

  static async obtenerTodos(estado = null) {
    let sql = "SELECT s.*, u.nombre as usuario_nombre FROM soporte s JOIN usuarios u ON s.usuario_cedula = u.cedula";
    const params = [];
    if (estado) {
      sql += " WHERE s.estado = ?";
      params.push(estado);
    }
    sql += " ORDER BY s.fecha_creacion DESC";
    return new Promise((resolve) => {
      db.query(sql, params, (err, results) => {
        if (err) return resolve([]);
        resolve(results);
      });
    });
  }

  toDict() {
    return {
      id: this.id,
      usuario_cedula: this.usuario_cedula,
      asunto: this.asunto,
      mensaje: this.mensaje,
      estado: this.estado,
      fecha_creacion: this.fecha_creacion,
      respuesta: this.respuesta,
      fecha_respuesta: this.fecha_respuesta
    };
  }
}

export default Soporte;
