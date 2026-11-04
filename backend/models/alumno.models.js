const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    // Acá agregamos el DNI
    dni: {
        type: String,
        required: true,
        unique: true
    },
    curso: {
        type: String,
        required: true
    },
    presente: {
        type: Boolean,
        default: false // Si no se envia, por defecto arranca en falso (ausente)
    },

    // 1. Contador de faltas justificadas (ej. con certificado médico)
    faltasJustificadas: {
        type: Number,
        default: 0
    },

    // 2. Contador de faltas injustificadas
    faltasInjustificadas: {
        type: Number,
        default: 0
    },

    // 3. Contador de llegadas tarde
    tardanzas: {
        type: Number,
        default: 0
    },

    // 4. Array de fechas de asistencia (guarda el historial de los días que vino)
    fechasAsistencia: [{
        type: Date
    }]

}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Alumno', alumnoSchema);