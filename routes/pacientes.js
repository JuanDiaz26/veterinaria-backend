const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Paciente = require('../models/Paciente');
const router = express.Router();

// Función para crear la cuenta de admin automáticamente
const crearCuentaAdmin = async () => {
  try {
    const adminCorreo = 'admin@veterinaria.com';
    let admin = await Paciente.findOne({ correo: adminCorreo });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const contraseñaEncriptada = await bcrypt.hash('admin1234', salt);

      admin = new Paciente({
        nombre: 'Admin',
        apellido: 'Administrador',
        correo: adminCorreo,
        telefono: '123456789',
        contraseña: contraseñaEncriptada,
        role: 'admin',
      });

      await admin.save();
      console.log('Cuenta de administrador creada');
    } else {
      console.log('El administrador ya existe');
    }
  } catch (error) {
    console.error('Error al crear la cuenta de administrador:', error);
  }
};

// Llama a la función para crear el administrador cuando la app arranca
crearCuentaAdmin();

// Ruta para registrar pacientes
router.post(
  '/registro',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('correo', 'Agrega un correo válido').isEmail(),
    check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    check('contraseña', 'La contraseña es obligatoria').exists(),
  ],
  async (req, res) => {
    const { nombre, apellido, correo, telefono, contraseña } = req.body;

    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let paciente = await Paciente.findOne({ correo });
      if (paciente) {
        return res.status(400).json({ msg: 'El paciente ya existe' });
      }

      const salt = await bcrypt.genSalt(10);
      const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

      paciente = new Paciente({
        nombre,
        apellido,
        correo,
        telefono,
        contraseña: contraseñaEncriptada,
      });

      await paciente.save();
      res.status(201).json({ msg: 'Paciente creado exitosamente' });
    } catch (error) {
      console.error('Error al registrar el paciente:', error);
      res.status(500).send('Error en el servidor');
    }
  }
);

// Ruta de inicio de sesión
router.post(
  '/login',
  [
    check('correo', 'Agrega un correo válido').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').exists(),
  ],
  async (req, res) => {
    const { correo, contraseña } = req.body;

    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const paciente = await Paciente.findOne({ correo });

      if (!paciente) {
        return res.status(400).json({ msg: 'Usuario no encontrado' });
      }

      const esCorrecta = await bcrypt.compare(contraseña, paciente.contraseña);

      if (!esCorrecta) {
        return res.status(400).json({ msg: 'Contraseña incorrecta' });
      }

      if (paciente.role === 'admin') {
        return res.json({ msg: 'Inicio de sesión exitoso', tipo: 'admin' });
      }

      res.json({ msg: 'Inicio de sesión exitoso', tipo: 'paciente' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  }
);

module.exports = router;
