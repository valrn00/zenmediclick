import db from "../database.js";
import crypto from "crypto";

class Usuario {
  constructor(cedula, nombre, email, password = null, rol = "paciente") {
    this.cedula = cedula;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
  }

  static hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  verificarPassword(password) {
    return this.password === Usuario.hashPassword(password);
  }

  static async crear(cedula, nombre, email, password, rol = "paciente") {
    const passwordHash = Usuario.hashPassword(password);
    const sql = "INSERT INTO usuarios (cedula, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)";
    return new Promise((resolve) => {
      db.query(sql, [cedula, nombre, email, passwordHash, rol], (err) => {
        if (err) {
          console.error("Error creando usuario:", err);
          return resolve(null);
        }
        resolve(new Usuario(cedula, nombre, email, passwordHash, rol));
      });
    });
  }

  static async obtenerPorCedula(cedula) {
    const sql = "SELECT * FROM usuarios WHERE cedula = ?";
    return new Promise((resolve) => {
      db.query(sql, [cedula], (err, results) => {
        if (err || results.length === 0) return resolve(null);
        const u = results[0];
        resolve(new Usuario(u.cedula, u.nombre, u.email, u.password, u.rol));
      });
    });
  }

  static async obtenerMedicosPorEspecialidad() {
    const sql = "SELECT cedula, nombre FROM usuarios WHERE rol = 'medico'";
    return new Promise((resolve) => {
      db.query(sql, [], (err, results) => {
        if (err) return resolve([]);
        resolve(results);
      });
    });
  }
}

export default Usuario;
