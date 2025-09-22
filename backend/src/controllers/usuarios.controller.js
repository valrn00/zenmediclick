import pool from "../config/db.js";

export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre, email FROM usuarios LIMIT 100");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en la consulta" });
  }
};
