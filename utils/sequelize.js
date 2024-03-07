import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración de Sequelize con variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false // Establece esto en false para desactivar el registro de consultas SQL
  }
);

// Autenticar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
  })
  .catch(err => {
    console.error('Error al conectarse a la base de datos:', err);
  });

export default sequelize;
