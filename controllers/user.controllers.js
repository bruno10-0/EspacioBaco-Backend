import {Usuario} from "../models/user.model.js"

export const obtenerUsuarios = async (req, res) => {
    try {
      // Consultar todos los usuarios desde la base de datos
      const usuarios = await Usuario.findAll();
  
      // Verificar si se encontraron usuarios
      if (usuarios.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron usuarios.' });
      }
  
      // Enviar la lista de usuarios como respuesta
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  };