# Guía de Estándares de Código - ZenMediClick

Este documento define las convenciones y estándares de codificación que el equipo seguirá para garantizar calidad, legibilidad y mantenibilidad del código.

---

## 1. Python
- Uso de **snake_case** para variables y funciones.
- Uso de **CamelCase** para clases.
- Inclusión de **docstrings** en funciones y clases, siguiendo la convención PEP257.
- Imports siempre al inicio del archivo.
- Líneas de máximo **79 caracteres**.
- Se debe usar **tipado opcional** cuando sea posible.

**Ejemplo:**
```python
import datetime

def registrar_usuario(nombre: str, email: str) -> dict:
    """
    Registra un nuevo usuario en el sistema.
    
    Args:
        nombre (str): Nombre del usuario.
        email (str): Correo electrónico del usuario.

    Returns:
        dict: Información del usuario creado.
    """
    return {"nombre": nombre, "email": email, "fecha_registro": datetime.datetime.now()}
