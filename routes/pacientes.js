const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Paciente = require('../models/Paciente');

// Ruta de registro de paciente
router.post(
  '/registro',
  [
    // Validaciones usando express-validator
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('correo', 'Agrega un correo válido').isEmail(),
    check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    check('contraseña', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('confirmarContraseña', 'Confirma tu contraseña')
      .exists()
      .custom((value, { req }) => value === req.body.contraseña) // Verifica que coincida con la contraseña
      .withMessage('Las contraseñas no coinciden'),
  ],
  async (req, res) => {
    const errores = validationResult(req);

    // Si hay errores de validación, devolverlos
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, apellido, correo, telefono, contraseña } = req.body;

    try {
      // Verificar si el paciente ya existe
      let paciente = await Paciente.findOne({ correo });

      if (paciente) {
        return res.status(400).json({ msg: 'El paciente ya está registrado' });
      }

      // Crear nuevo paciente
      paciente = new Paciente({
        nombre,
        apellido,
        correo,
        telefono,
        contraseña,
      });

      // Encriptar la contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      paciente.contraseña = await bcrypt.hash(contraseña, salt);

      // Guardar el paciente en la base de datos
      await paciente.save();

      res.json({ msg: 'Paciente registrado con éxito' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  }
);

module.exports = router;
