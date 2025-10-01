
import express from "express";
import Usuario from "../models/usuario.js";

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
    try {
        const { cedula, password } = req.body;
        if (!cedula || !password) {
            return res.json({ success: false, message: "Cedula y contraseña requeridos" });
        }
        const usuario = await Usuario.obtenerPorCedula(cedula);
        if (usuario && await usuario.verificarPassword(password)) {
            req.session.user_cedula = usuario.cedula;
            req.session.user_name = usuario.nombre;
            req.session.user_rol = usuario.rol;
            return res.json({
                success: true,
                message: "Login exitoso",
                rol: usuario.rol,
                nombre: usuario.nombre
            });
        } else {
            return res.json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (e) {
        console.error("Error en login:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Registro
router.post("/registro", async (req, res) => {
    try {
        const { cedula, nombre, email, password, rol = "paciente" } = req.body;
        if (!cedula || !nombre || !email || !password) {
            return res.json({ success: false, message: "Todos los campos son requeridos" });
        }
        const usuarioExistente = await Usuario.obtenerPorCedula(cedula);
        if (usuarioExistente) {
            return res.json({ success: false, message: "El usuario ya existe" });
        }
        const nuevoUsuario = await Usuario.crear(cedula, nombre, email, password, rol);
        if (nuevoUsuario) {
            return res.json({ success: true, message: "Usuario registrado exitosamente" });
        } else {
            return res.json({ success: false, message: "Error al registrar usuario" });
        }
    } catch (e) {
        console.error("Error en registro:", e);
        return res.json({ success: false, message: "Error interno del servidor" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: "Sesión cerrada" });
    });
});

export default router;