import bcrypt from 'bcrypt';
import { Usuario } from '../models/user.model.js';

const initAdminUser = async () => {
    try {
      const adminExists = await Usuario.findOne({ where: { tipo: 'admin' } });
  
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('Admin1234', 10);
        await Usuario.create({
          tipo: 'admin',
          nombre: 'Admin',
          apellido: 'User',
          correo: 'espaciobacoadmin@gmail.com',
          contrasenia: hashedPassword,
          telefono: 'xxxxxxxxxx',
          direccion: 'xxxxxxxxxx'
        });
        console.log('Admin user created');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  };
  
  export default initAdminUser;