import { Usuario } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
//region obtenerUsuarios

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

//region obtenerUsuarioPorId

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

//region crearUsuario

export const crearUsuario = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    let { nombre, apellido, correo, telefono, direccion, contrasenia, tipo } =
      req.body;

    if (!tipo) {
      tipo = "normal";
    }
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

    const token = await createAccessToken({ id: nuevoUsuario.id });

    // Enviar el nuevo usuario creado como respuesta
    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      token,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

//region crearUsuarioPorAdmin

export const crearUsuarioPorAdmin = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { nombre, apellido, correo, telefono, direccion, contrasenia, tipo } =
      req.body;

    if (!tipo) {
      tipo = "normal";
    }
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

    await Usuario.create({
      tipo,
      nombre,
      apellido,
      correo,
      telefono,
      direccion,
      contrasenia: contraseniaHash,
    });

    res.status(201).json({ mensaje: "Usuario creado exitosamente." });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};
//region iniciarSesion

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
    // Generar token de acceso
    const token = await createAccessToken({ id: usuario.id });

    // Enviar respuesta exitosa con los datos de el usuario y el token de acceso.
    res.status(201).json({
      mensaje: "Inicio de sesión exitoso",
      token, // Envía el token al frontend
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al iniciar sesión" });
  }
};
//region editarUsuario

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

    // validar si es correo no le pertenece a otro usuario
    if (usuario.correo !== correo) {
      // Verificar si el correo ya está en uso por otro usuario
      const usuarioConCorreo = await Usuario.findOne({ where: { correo } });

      if (usuarioConCorreo && usuarioConCorreo.id !== id) {
        return res
          .status(400)
          .json({ mensaje: "El correo ya está en uso por otro usuario." });
      }
    }

    // Actualizar los datos del usuario sin validar el teléfono si es el mismo usuario
    if (usuario.telefono !== telefono) {
      // Verificar si el teléfono ya está en uso por otro usuario
      const usuarioConTelefono = await Usuario.findOne({ where: { telefono } });

      if (usuarioConTelefono && usuarioConTelefono.id !== id) {
        return res
          .status(400)
          .json({ mensaje: "El teléfono ya está en uso por otro usuario." });
      }
    }

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

//region eliminarUsuario

export const eliminarUsuario = async (req, res) => {
  const tokenHeader = req.headers.authorization;

  const token = tokenHeader.split(" ")[1]; // Obtener solo el token sin 'Bearer'

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  try {
    // Obtener el ID del usuario desde los parámetros de la solicitud
    const { id } = req.params;

    // Buscar el usuario por su ID en la base de datos
    const usuario = await Usuario.findByPk(id);

    // Verificar si se encontró el usuario
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Verificar si el ID del usuario extraído del token es igual al ID que se desea eliminar.
    // Si son iguales, se devuelve un estado de respuesta 403 con un mensaje indicando que no se permite eliminar la propia cuenta de usuario.
    if (decodedToken.id == id) {
      return res.status(403).json({
        mensaje: "No puedes eliminar tu propia cuenta de usuario.",
      });
    }
    //Verificar si el usuario tiene una orden activa.
    const ordenes = await Order.findAll({ where: { idUsuario: id } });

    if (ordenes.length > 0) {
      return res.status(403).json({
        mensaje:
          "No puedes eliminar este usuario porque tiene una orden activa.",
      });
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

//region eliminarUsuarios

export const eliminarUsuarios = async (req, res) => {
  const tokenHeader = req.headers.authorization;

  const token = tokenHeader.split(" ")[1]; // Obtener solo el token sin 'Bearer'

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  try {
    // Obtener los IDs de los usuarios a eliminar desde el cuerpo de la solicitud
    const { ids } = req.body;

    // Verificar si se proporcionaron IDs válidos
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere al menos un ID de usuario válido." });
    }

    // Verificar si algún id de la lista de ids es igual al id extraído del token.
    if (ids.some((id) => id == decodedToken.id)) {
      return res.status(403).json({
        mensaje:
          "En la lista de ID detectamos que por accidente incluiste tu propia cuenta, lo cual no es aceptable.",
      });
    }

    // Verificar si alguno de los usuarios tiene órdenes activas
    const ordenesActivas = await Order.findAll({
      where: {
        idUsuario: ids,
        estado: true, // 'estado: true' indica que la orden está activa
      },
    });

    if (ordenesActivas.length > 0) {
      return res.status(403).json({
        mensaje: "No puedes eliminar usuarios que tienen órdenes activas.",
      });
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

//region editar mi usuario

export const editMyUser = async (req, res) => {
  const { token, nombre, apellido, correo, telefono, direccion } = req.body;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "Acceso no autorizado, token no proporcionado." });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id } = decoded;

    let usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    if (usuario.correo !== correo) {
      const usuarioConCorreo = await Usuario.findOne({ where: { correo } });

      if (usuarioConCorreo && usuarioConCorreo.id !== id) {
        return res
          .status(400)
          .json({ mensaje: "El correo ya está en uso por otro usuario." });
      }
    }

    if (usuario.telefono !== telefono) {
      const usuarioConTelefono = await Usuario.findOne({ where: { telefono } });

      if (usuarioConTelefono && usuarioConTelefono.id !== id) {
        return res
          .status(400)
          .json({ mensaje: "El teléfono ya está en uso por otro usuario." });
      }
    }

    // Actualizar los datos del usuario solo si han cambiado
    if (usuario.nombre !== nombre) usuario.nombre = nombre;
    if (usuario.apellido !== apellido) usuario.apellido = apellido;
    if (usuario.correo !== correo) usuario.correo = correo;
    if (usuario.telefono !== telefono) usuario.telefono = telefono;
    if (usuario.direccion !== direccion) usuario.direccion = direccion;

    await usuario.save();

    res
      .status(200)
      .json({ usuario, mensaje: "Tu información ha sido actualizada exitosamente." });
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res.status(500).json({ mensaje: "Ocurrió un error al editar el usuario." });
  }
};

//region verificarToken

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
      creacion: usuarioEncontrado.createdAt,
      actualizacion: usuarioEncontrado.updatedAt,
    });
  } catch (error) {
    if (error.message === "jwt expired") {
      return res
        .status(401)
        .json({ mensaje: "Acceso no autorizado, token expirado." });
    } else {
      return res
        .status(401)
        .json({ mensaje: "Acceso no autorizado, token inválido." });
    }
  }
};
