import jwt from "jsonwebtoken";

export const verificarToken = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token requerido" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.rol)) {
        return res.status(403).json({ message: "No tienes permisos" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido" });
    }
  };
};
