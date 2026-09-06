const mongoose = require('mongoose');

// Definir el esquema o la estructura que tendran los documentos en Mongo DB
const alumnoSchema = new mongoose.Schema({
    dni: {
        type: String,
        required: true,
        unique: true 
    },
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: true 
    },
    curso: { 
        type: String, 
        required: true
    },
    presente: {
        type: Boolean,
        default: false // Si no se envía, por defecto arranca en falso (ausente)
    },
    faltas: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Agregar fecha de creación y actualización automáticamente
});

module.exports = mongoose.model('Alumno', alumnoSchema);