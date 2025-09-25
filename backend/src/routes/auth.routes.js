import { Router } from "express";
import { register, login, recoverPassword, resetPassword } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/recover", recoverPassword);
router.post("/reset/:token", resetPassword);

export default router;
