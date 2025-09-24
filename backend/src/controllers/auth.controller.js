import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];

    // ⚠️ Si tu contraseña está guardada en texto plano, usa:
    // if (password !== user.password) { ... }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "✅ Login exitoso",
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        tipo: user.tipo
      }
    });

  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    // Verificar si ya existe
    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    await pool.query(
      "INSERT INTO usuarios (nombre, apellido, email, telefono, password, tipo) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone, hashedPassword, "paciente"]
    );

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("❌ Error en registro:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
