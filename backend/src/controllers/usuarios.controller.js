import bcrypt from "bcryptjs";
import { Usuario } from "../models/usuario.model.js";

export const registrar = async (req, res) => {
  try {
    const { nombre, email, password, rol, id_ips } = req.body;

    const hashedPass = await bcrypt.hash(password, 10);
    const id = await Usuario.create(nombre, email, hashedPass, rol, id_ips);

    res.json({ message: "Usuario registrado", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
