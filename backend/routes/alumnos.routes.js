const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnos.controller');

// 1. Obtener todos los alumnos (o filtrar por curso)
router.get('/', alumnosController.obtenerAlumnos);

// 2. Crear un nuevo alumno
router.post('/', alumnosController.crearAlumno);

// 3. Buscar un alumno por su DNI
router.get('/dni/:dni', alumnosController.obtenerAlumnoPorDni);

// 4. Registrar asistencia diaria (Presente o Ausente)
router.put('/:id/asistencia', alumnosController.registrarAsistencia);

// 5. Actualizar datos de un alumno
router.put('/:id', alumnosController.actualizarAlumno);

// 6. Eliminar un alumno
router.delete('/:id', alumnosController.eliminarAlumno);

module.exports = router;