import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, phone, password: hashedPassword });
    res.status(201).json({ message: "Usuario registrado", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id }, "secretKey", { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const recoverPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  const token = jwt.sign({ id: user.id }, "resetSecret", { expiresIn: "15m" });
  const resetLink = `http://localhost:5173/auth/password-recovery/password-reset.html?token=${token}`;

  await sendEmail(email, "Recuperación de contraseña", `Haz click aquí: ${resetLink}`);
  res.json({ message: "Correo de recuperación enviado" });
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, "resetSecret");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update({ password: hashedPassword }, { where: { id: decoded.id } });
    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
};
