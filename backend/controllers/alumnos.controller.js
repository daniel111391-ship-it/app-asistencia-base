const Alumno = require('../models/alumno.models'); // Importamos el modelo real de la base de datos

// GET: Obtener todos los alumnos
exports.obtenerAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.status(200).json({ ok: true, datos: alumnos });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al obtener alumnos', error: error.message });
    }
};

// GET: Obtener un alumno por DNI
exports.obtenerAlumnoPorDni = async (req, res) => {
    try {
        const alumno = await Alumno.findOne({ dni: req.params.dni });
        if (!alumno) {
            return res.status(404).json({ ok: false, mensaje: 'Alumno no encontrado' });
        }
        res.status(200).json({ ok: true, datos: alumno });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error en el servidor', error: error.message });
    }
};

// POST: Agregar un nuevo alumno
exports.crearAlumno = async (req, res) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        res.status(201).json({ ok: true, mensaje: 'Alumno registrado en Atlas', datos: nuevoAlumno });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al registrar', error: error.message });
    }
};

// PUT: Actualizar alumno
exports.actualizarAlumno = async (req, res) => {
    try {
        const alumnoActualizado = await Alumno.findOneAndUpdate(
            { dni: req.params.dni },
            req.body,
            { new: true }
        );
        if (!alumnoActualizado) {
            return res.status(404).json({ ok: false, mensaje: 'Alumno no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Datos actualizados en Atlas', datos: alumnoActualizado });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar', error: error.message });
    }
};

// DELETE: Eliminar alumno
exports.eliminarAlumno = async (req, res) => {
    try {
        const alumnoEliminado = await Alumno.findOneAndDelete({ dni: req.params.dni });
        if (!alumnoEliminado) {
            return res.status(404).json({ ok: false, mensaje: 'Alumno no encontrado' });
        }
        res.status(200).json({ ok: true, mensaje: 'Alumno eliminado de Atlas correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar', error: error.message });
    }
};