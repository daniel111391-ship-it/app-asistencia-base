const mongoose = require('mongoose');

// Función asincrónica para establecer conexión con MongoDB
const conectarDB = async () => {
    try {
        // Intentamos conectar con los datos guardados en .env
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('¡Conectado a la base de datos de MongoDB Atlas!');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); // Detiene la app si no se puede conectar
    }
};

module.exports = conectarDB;const mongoose = require('mongoose');
