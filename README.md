# Veterinaria Backend

Este es el backend para el proyecto de la veterinaria "Patitas Felices". El objetivo de este proyecto es gestionar la información de los pacientes, incluyendo su registro y consultas.

## Instalación

Para comenzar a usar este backend, sigue estos pasos:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/JuanDiaz26/veterinaria-backend.git
   cd veterinaria-backend
Instalar las dependencias: Asegúrate de tener Node.js y npm instalados, luego ejecuta:

bash
Copiar código
npm install
Crear el archivo .env (opcional, si utilizas variables de entorno):

env
Copiar código
MONGO_URI=mongodb://localhost:27017/veterinaria
PORT=5000
Iniciar MongoDB: Asegúrate de que MongoDB esté corriendo en tu máquina local.

Iniciar el servidor:

bash
Copiar código
npm start
El servidor estará disponible en http://localhost:5000.

Dependencias
Este proyecto utiliza las siguientes dependencias:

express: Para crear el servidor.
mongoose: Para conectarse y manejar la base de datos MongoDB.
bcryptjs: Para encriptar contraseñas.
express-validator: Para validar datos de entrada.
Rutas
POST /api/pacientes/registro: Para registrar nuevos pacientes.
Contribuciones
Recibí ayuda de ChatGPT para resolver dudas y mejorar la implementación del proyecto, ya que no profundizamos en algunos temas durante el curso.