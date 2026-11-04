const Usuario = require('../models/usuario.models');
const bcrypt = require('bcryptjs');

// 1. Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.status(200).json({ ok: true, datos: usuarios });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al consultar usuarios', error: error.message });
    }
};

// 2. Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findById(id).select('-password');
        if (!usuario) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ ok: true, datos: usuario });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al buscar el usuario', error: error.message });
    }
};

// 3. Crear un nuevo usuario (CON DNI)
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol, dni } = req.body; 
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Nombre, email y contraseña son obligatorios' });
        }
        
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({ ok: false, mensaje: 'El correo electrónico ya está registrado' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);
        
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordEncriptada,
            rol: rol || 'alumno',
            dni // Guardamos el DNI en la base de datos
        });
        
        const usuarioGuardado = await nuevoUsuario.save();
        const respuesta = usuarioGuardado.toObject();
        delete respuesta.password;
        
        res.status(201).json({
            ok: true,
            mensaje: 'Usuario registrado exitosamente en MongoDB Atlas',
            datos: respuesta
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al crear usuario', error: error.message });
    }
};

// 4. Actualizar datos de un usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...restoDatos } = req.body;
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            restoDatos,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!usuarioActualizado) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario actualizado correctamente',
            datos: usuarioActualizado
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar usuario', error: error.message });
    }
};

// 5. Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar usuario', error: error.message });
    }
};

// 6. Iniciar sesión (CON DNI)
exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ ok: false, mensaje: 'El correo y la contraseña son obligatorios' });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas: correo no encontrado' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas: contraseña incorrecta' });
        }

        res.status(200).json({ 
            ok: true,
            mensaje: 'Ingreso exitoso', 
            datos: { 
                id: usuario._id, 
                nombre: usuario.nombre, 
                email: usuario.email,
                rol: usuario.rol,
                dni: usuario.dni // Devolvemos el DNI a React
            } 
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al intentar iniciar sesión', error: error.message });
    }
};

// 7. Obtener todos los usuarios que son alumnos
exports.obtenerUsuariosAlumnos = async (req, res) => {
    try {
        const usuarios = await Usuario.find({ rol: 'alumno' }).select('-password'); 
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las cuentas' });
    }
};

// 8. Actualizar credenciales
exports.actualizarCredenciales = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findById(req.params.id);
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Cuenta no encontrada' });
        }

        if (email) usuario.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(password, salt);
        }

        await usuario.save();
        res.json({ msg: 'Credenciales actualizadas correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar credenciales' });
    }
};