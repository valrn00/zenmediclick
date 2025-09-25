import { Router } from "express";
import { registrar } from "../controllers/usuarios.controller.js";

const router = Router();

router.post("/register", registrar);

export default router;
