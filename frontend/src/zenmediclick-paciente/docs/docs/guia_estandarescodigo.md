# Guía de Estándares de Código – ZenMediClick

## 1. Estilo general
- Usar **inglés** para nombres de variables, funciones y clases.
- Usar **snake_case** para variables y funciones (`register_user`).
- Usar **PascalCase** para clases (`UserModel`).
- Usar 4 espacios para indentación en Python y 2 espacios en HTML/CSS/JS.
- No dejar código comentado innecesario en producción.

## 2. Reglas para Python (Backend – FastAPI)
- Todas las funciones deben tener **docstrings**.
- Importaciones ordenadas (módulos estándar, luego terceros, luego internos).
- Nombres de variables descriptivos (mínimo 3 caracteres).
- Manejo de errores con `try/except`.
- Cumplir con PEP8 usando `flake8`.

## 3. Reglas para HTML/CSS/JS (Frontend)
- Etiquetas en minúsculas.
- Sangría consistente de 2 espacios.
- CSS en archivos separados (`styles.css`).
- JavaScript en archivos separados (`scripts.js`).
- Usar `const` y `let` en lugar de `var`.

## 4. Control de Versiones (Git)
- Nombrar ramas usando el patrón: `feature/nombre-funcionalidad`.
- Commits descriptivos en español.
- Hacer `pull` antes de subir cambios.
- Revisar código de otros miembros antes de fusionar.

## 5. Buenas prácticas de seguridad
- No almacenar contraseñas en texto plano.
- Usar variables de entorno (`.env`) para credenciales.
- Validar entradas del usuario en backend y frontend.
