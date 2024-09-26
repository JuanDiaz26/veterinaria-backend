const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // Asegúrate de importar bcrypt
const Paciente = require('../models/Paciente'); // Importa tu modelo Paciente
const router = express.Router();

// Función para crear la cuenta de admin automáticamente
const crearCuentaAdmin = async () => {
  try {
    const adminCorreo = 'admin@veterinaria.com'; // Correo del admin predefinido
    let admin = await Paciente.findOne({ correo: adminCorreo });

    if (!admin) {
      // Si el admin no existe, crearlo
      const salt = await bcrypt.genSalt(10);
      const contraseñaEncriptada = await bcrypt.hash('admin1234', salt); // Contraseña del admin

      admin = new Paciente({
        nombre: 'Admin',
        apellido: 'Administrador',
        correo: adminCorreo,
        telefono: '123456789',
        contraseña: contraseñaEncriptada,
        role: 'admin', // Campo adicional para distinguir al admin
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

      // Comparar la contraseña encriptada
      const esCorrecta = await bcrypt.compare(contraseña, paciente.contraseña);

      if (!esCorrecta) {
        return res.status(400).json({ msg: 'Contraseña incorrecta' });
      }

      // Verificar si es admin
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
