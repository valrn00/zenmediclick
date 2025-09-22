import pool from "../config/db.js";

export const login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  pool.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err.message);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length > 0) {
      res.json({ message: "✅ Login exitoso", user: results[0] });
    } else {
      res.status(401).json({ message: "❌ Credenciales incorrectas" });
    }
  });
};
