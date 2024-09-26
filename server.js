const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa cors
const pacientesRoutes = require('./routes/pacientes'); // Importa las rutas de pacientes
const bcrypt = require('bcryptjs'); // Asegúrate de importar bcrypt


const app = express();

// Middleware para manejar datos en formato JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors()); // Aquí es donde configuras CORS

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/veterinaria', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas
app.use('/api/pacientes', pacientesRoutes); // Ruta para los pacientes

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
