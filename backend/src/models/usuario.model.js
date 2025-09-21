import db from "../config/db.js";

export const Usuario = {
  async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return rows[0];
  },

  async create(nombre, email, password, rol, id_ips) {
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, rol, id_ips) VALUES (?,?,?,?,?)",
      [nombre, email, password, rol, id_ips]
    );
    return result.insertId;
  }
};
