"""
Módulo usuarios.py
Gestión básica de usuarios para ZenMediClick.
Incluye funciones para registrar, obtener y listar usuarios.
"""

from datetime import datetime

# Lista temporal para simular una base de datos de usuarios
usuarios = []


def registrar_usuario(nombre, cedula, email, rol):
    """
    Registra un nuevo usuario en el sistema.

    Args:
        nombre (str): Nombre completo del usuario.
        cedula (str): Número de cédula único.
        email (str): Dirección de correo electrónico.
        rol (str): Rol del usuario (Paciente, Medico, Administrador).

    Returns:
        dict: Diccionario con los datos del usuario registrado.
    """
    usuario = {
        "id": len(usuarios) + 1,
        "nombre": nombre,
        "cedula": cedula,
        "email": email,
        "rol": rol,
        "fecha_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    usuarios.append(usuario)
    return usuario


def obtener_usuario_por_cedula(cedula):
    """
    Busca y devuelve un usuario por su cédula.

    Args:
        cedula (str): Número de cédula del usuario.

    Returns:
        dict | None: Datos del usuario si existe, de lo contrario None.
    """
    for usuario in usuarios:
        if usuario["cedula"] == cedula:
            return usuario
    return None


def listar_usuarios():
    """
    Retorna la lista completa de usuarios registrados.

    Returns:
        list: Lista de diccionarios con información de los usuarios.
    """
    return usuarios


# Ejemplo de uso del módulo
if __name__ == "__main__":
    registrar_usuario(
        "Ana García",
        "1001001001",
        "ana.garcia@email.com",
        "Paciente",
    )
    registrar_usuario(
        "Dr. Juan Pérez",
        "3003003003",
        "juan.perez@medico.com",
        "Medico",
    )

    print("Lista de usuarios:")
    for u in listar_usuarios():
        print(
            f"- {u['nombre']} "
            f"({u['rol']})"
        )
