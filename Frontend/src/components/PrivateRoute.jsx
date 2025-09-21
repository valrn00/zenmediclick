import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Validar si el rol está permitido
    if (roles && !roles.includes(decoded.rol)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
