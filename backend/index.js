// 1. importar librerias
const express = require ('express');
const cors = require('cors'); //Importar la libreria de cors para evitar bloqueos
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()

// 2. Middlewares (para que el servidor entienda el formato .json)
app.use(cors()); // Permite periciones de dominios cruzados
app.use(express.json()); // Habilita a Express a leer y entender el formato JSON en el req.body

// 3. conección a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('¡Conectado a la base de datos de MongoDB Atlas!'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas de la aplicación
// Importamos las rutas del recurso producto
const alumnosRoutes = require('./routes/alumnos.routes');

// Definimos el sufijo de ruta que queremos usar en la url
app.use('/api/alumnos', alumnosRoutes);

// 4. ruta de prueba (método GET)

app.get('/', (req,res) => {
    res.json({
        mensaje: "Api funciona correctamente",
        estado: "ok"
    });
});

// 5. Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
})