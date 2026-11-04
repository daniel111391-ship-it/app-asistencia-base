const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// 1. Obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// 7. Obtener todos los usuarios que son alumnos (DEBE ir antes del /:id)
router.get('/alumnos', usuarioController.obtenerUsuariosAlumnos);

// 2. Obtener un usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// 3. Crear un nuevo usuario (Registro)
router.post('/', usuarioController.crearUsuario);

// 4. Actualizar datos de un usuario
router.put('/:id', usuarioController.actualizarUsuario);

// 8. Actualizar credenciales (Correo o Contraseña) desde el panel preceptor
router.put('/:id/credenciales', usuarioController.actualizarCredenciales);

// 5. Eliminar un usuario
router.delete('/:id', usuarioController.eliminarUsuario);

// 6. Iniciar sesión (Login) - La ruta nueva para tu formulario
router.post('/login', usuarioController.loginUsuario);

module.exports = router;