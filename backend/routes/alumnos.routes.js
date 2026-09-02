const express = require('express');
const router = express.Router();

// Impartar el controlador con las funciones de métodos
const alumnosController = require('../controllers/alumnos.controller');

// Definir las rutas con los endpoints mapeados con los métodos HTTP correspondientes

router.get('/', alumnosController.obtenerAlumnos); // GET - para ver todos los alumnos
router.get('/:dni', alumnosController.obtenerAlumnoPorDni); // GET - obtener uno específico
router.post('/', alumnosController.crearAlumno);            // POST - crear alumno
router.put('/:dni', alumnosController.actualizarAlumno);    // PUT - actualizar por DNI
router.delete('/:dni', alumnosController.eliminarAlumno);   // DELETE - eliminar por DNI

module.exports = router;