import { Usuario } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const obtenerUsuarios = async (req, res) => {
  try {
    // Consultar todos los usuarios desde la base de datos
    const usuarios = await Usuario.findAll();

    // Verificar si se encontraron usuarios
    if (usuarios.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron usuarios." });
    }

    // Enviar la lista de usuarios como respuesta
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    // Obtener el ID del usuario desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar el usuario por su ID en la base de datos
    const usuario = await Usuario.findByPk(id);

    // Verificar si se encontró el usuario
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Enviar el usuario encontrado como respuesta
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { tipo, nombre, apellido, correo, telefono, direccion, contrasenia } =
      req.body;

    // Verificar si ya existe un usuario con el mismo correo
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe un usuario con este correo." });
    }

    // Hasear la contrasenia
    const contraseniaHash = await bcrypt.hash(contrasenia, 10);

    // Crear un nuevo usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      tipo,
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      contrasenia: contraseniaHash,
    });

    const usuarioSinContrasenia = {
      tipo: nuevoUsuario.tipo,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      correo: nuevoUsuario.correo,
      telefono: nuevoUsuario.telefono,
      direccion: nuevoUsuario.direccion,
    };

    const token = await createAccessToken({ id: nuevoUsuario.id });

    // Enviar el nuevo usuario creado como respuesta
    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: usuarioSinContrasenia,
      token
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    // Buscar usuario por correo electrónico
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Verificar si la contraseña es correcta
    const contraseniaValida = await bcrypt.compare(
      contrasenia,
      usuario.contrasenia
    );

    if (!contraseniaValida) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const datosUsuario = {
      tipo: usuario.tipo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
    };

    // Generar token de acceso
    const token = await createAccessToken({ id: usuario.id });

    // Enviar respuesta exitosa con los datos de el usuario y el token de acceso.
    res.status(201).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: datosUsuario,
      token, // Envía el token al frontend
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al iniciar sesión" });
  }
};

export const cerrarSesion = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const editarUsuario = async (req, res) => {
  try {
    // Obtener el ID del usuario desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar el usuario por su ID en la base de datos
    let usuario = await Usuario.findByPk(id);

    // Verificar si se encontró el usuario
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Extraer los datos actualizados del cuerpo de la solicitud
    const { tipo, nombre, apellido, correo, telefono, direccion } = req.body;

    // Actualizar los datos del usuario
    usuario.tipo = tipo;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.correo = correo;
    usuario.telefono = telefono;
    usuario.direccion = direccion;

    // Guardar los cambios en la base de datos
    await usuario.save();

    // Enviar el usuario actualizado como respuesta
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    // Obtener el ID del usuario desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar el usuario por su ID en la base de datos
    const usuario = await Usuario.findByPk(id);

    // Verificar si se encontró el usuario
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Eliminar el usuario de la base de datos
    await usuario.destroy();

    // Enviar un mensaje de éxito como respuesta
    res.status(200).json({ mensaje: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const eliminarUsuarios = async (req, res) => {
  try {
    // Obtener los IDs de los usuarios a eliminar desde el cuerpo de la solicitud
    const { ids } = req.body;

    // Verificar si se proporcionaron IDs válidos
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere al menos un ID de usuario válido." });
    }

    // Eliminar los usuarios de la base de datos
    await Usuario.destroy({ where: { id: ids } });

    // Enviar un mensaje de éxito como respuesta
    res.status(200).json({ mensaje: "Usuarios eliminados correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuarios:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const verificarToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso no autorizado, token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id } = decoded;

    const usuarioEncontrado = await Usuario.findByPk(id);
    if (!usuarioEncontrado) {
      return res
        .status(401)
        .json({ mensaje: "Acceso no autorizado, usuario no encontrado." });
    }

    return res.status(201).json({
      tipo: usuarioEncontrado.tipo,
      nombre: usuarioEncontrado.nombre,
      apellido: usuarioEncontrado.apellido,
      correo: usuarioEncontrado.correo,
      telefono: usuarioEncontrado.telefono,
      direccion: usuarioEncontrado.direccion,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ mensaje: "Acceso no autorizado, token inválido." });
  }
};
