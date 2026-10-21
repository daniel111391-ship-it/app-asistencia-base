const Alumno = require('../models/alumno.models');

// 1. Obtener todos los alumnos (con opción a filtrar por curso)
exports.obtenerAlumnos = async (req, res) => {
    try {
    // Si el preceptor busca un curso específico (ej: ?curso=1ro 1ra), lo filtramos
    const filtro = req.query.curso ? { curso: req.query.curso } : {};
    const alumnos = await Alumno.find(filtro);
    
    res.json(alumnos);
    } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los alumnos' });
    }
};

// 2. Dar de alta un nuevo alumno
exports.crearAlumno = async (req, res) => {
    try {
    const nuevoAlumno = new Alumno(req.body);
    await nuevoAlumno.save();
    res.status(201).json(nuevoAlumno);
    } catch (error) {
    console.error(error);
    res.status(400).json({ msg: 'Error al crear el alumno' });
    }
};

// 3. Tomar Asistencia (El equivalente a "reservarClase" del profe)
exports.registrarAsistencia = async (req, res) => {
    try {
    const { id } = req.params;
    const { presente, justificada } = req.body; 

    const alumno = await Alumno.findById(id);

    if (!alumno) {
        return res.status(404).json({ msg: 'Alumno no encontrado' });
    }

    if (presente) {
      // Si el alumno vino, guardamos la fecha de hoy en su historial
        alumno.fechasAsistencia.push(new Date());
        alumno.presente = true;
    } else {
      // Si faltó, sumamos la falta a su contador específico
        alumno.presente = false;
        if (justificada) {
        alumno.faltasJustificadas += 1;
        } else {
        alumno.faltasInjustificadas += 1;
        }
    }

    await alumno.save();
    res.json({ msg: 'Asistencia registrada con éxito', alumno });
    } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar la asistencia' });
    }
};

// 4. Actualizar datos generales del alumno
exports.actualizarAlumno = async (req, res) => {
    try {
    const { id } = req.params;
    const alumnoActualizado = await Alumno.findByIdAndUpdate(id, req.body, { new: true });
    if (!alumnoActualizado) {
        return res.status(404).json({ msg: 'Alumno no encontrado' });
    }
    res.json({ msg: 'Datos actualizados correctamente', alumno: alumnoActualizado });
    } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar datos' });
    }
};

// 5. Eliminar un alumno del sistema
exports.eliminarAlumno = async (req, res) => {
    try {
    const { id } = req.params;
    const alumnoEliminado = await Alumno.findByIdAndDelete(id);
    if (!alumnoEliminado) {
        return res.status(404).json({ msg: 'Alumno no encontrado' });
    }
    res.json({ msg: 'Alumno eliminado correctamente' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el alumno' });
    }
};