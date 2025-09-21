import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Usuario } from "../models/usuario.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
