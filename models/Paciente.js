const mongoose = require('mongoose');

// Definir el esquema del paciente
const pacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // Este campo es obligatorio
  },
  apellido: {
    type: String,
    required: true, // Este campo es obligatorio
  },
  correo: {
    type: String,
    required: true,
    unique: true, // El correo debe ser único
  },
  telefono: {
    type: String,
    required: true, // Este campo es obligatorio
  },
  contraseña: {
    type: String,
    required: true, // Este campo es obligatorio
  },
  role: { // Agrega este campo
    type: String,
    default: 'paciente', // Valor por defecto
  },
});

// Crear el modelo de Paciente basado en el esquema
const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
