# 🎓 Sistema de Asistencia "Aula"

Plataforma web de gestión de asistencias y perfiles desarrollada para la **Escuela Agrotécnica Ejército Argentino** (Valle Fértil, San Juan). El sistema automatiza el control de presentismo y permite la visualización de estadísticas de los estudiantes en tiempo real a través de una arquitectura con base de datos en la nube.

## 🚀 Tecnologías Utilizadas

* **Frontend:** React, React Router DOM, Recharts (para visualización de datos).
* **Backend:** Node.js, Express.
* **Base de Datos:** MongoDB Atlas (Mongoose).
* **Seguridad:** Encriptación de contraseñas con bcryptjs, almacenamiento de sesiones en localStorage.

## 👥 Perfiles y Funcionalidades

1. **Director / Administrador (`admin`)**
   * Panel de control global para visualizar todas las cuentas del sistema (preceptores y alumnos).
   * Restablecimiento forzado de contraseñas mediante un sistema de modales integrados.
2. **Preceptor (`preceptor`)**
   * Filtrado dinámico de listas de alumnos segmentado por cursos y divisiones.
   * Registro instantáneo de estados: Presente, Ausente, Falta Justificada y Tardanza.
   * Interfaz de gestión para restablecer credenciales de los estudiantes.
3. **Estudiante (`alumno`)**
   * Panel individual protegido por autenticación y vinculado por DNI.
   * Visualización del rendimiento de asistencia mediante gráficos interactivos de torta.

## ⚙️ Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd app-asistencia-base