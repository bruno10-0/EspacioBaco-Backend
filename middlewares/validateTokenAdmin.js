import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Usuario } from "../models/user.model.js";

dotenv.config();

export const validateTokenAdmin = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      mensaje: "No se recibió un Token. Autorización denegada.",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    const usuario = await Usuario.findOne({ where: { id: decodedToken.id } });

    if (!usuario) {
      return res.status(403).json({
        mensaje:
          "Usuario no encontrado en la base de datos. Autorización denegada.",
      });
    }

    if (usuario.tipo !== "admin") {
      return res.status(403).json({
        mensaje:
          "El usuario no tiene privilegios de administrador. Autorización denegada.",
      });
    }

    // Si llegamos aquí, el usuario es un administrador
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        mensaje: "El Token ha expirado. Autorización denegada.",
      });
    }

    console.error("Error al verificar el usuario en la base de datos:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor al verificar el usuario.",
    });
  }
};
