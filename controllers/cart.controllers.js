import { Cart } from "../models/cart.model.js";
import { Usuario } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const crearCarritoDeCompras = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const usuario = await Usuario.findByPk(decodedToken.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verifica si ya existe un carrito para este usuario
    let carrito = await Cart.findOne({ where: { usuarioId: decodedToken.id } });

    if (carrito) {
      return res.status(200).json(carrito); // Devuelve el carrito existente
    }

    // Si no existe un carrito, crea uno nuevo
    carrito = await Cart.create({ usuarioId: decodedToken.id });

    return res.status(201).json(carrito); // Devuelve el carrito creado
  } catch (error) {
    console.error("Error al crear o buscar el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarCarritoDeCompras = async (req, res) => {
  try {
    const { token, productos } = req.body;

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    // Verifica si el usuario existe
    const usuario = await Usuario.findByPk(decodedToken.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Busca el carrito de compras del usuario
    let carrito = await Cart.findOne({ where: { usuarioId: decodedToken.id } });
    if (!carrito) {
      return res
        .status(404)
        .json({ error: "Carrito de compras no encontrado" });
    }

    let total = 0;
    let cantidadTotal = 0;
    let envioGratis = false;

    // Recorremos el array de productos y calculamos el total y la cantidadTotal
    if (productos) {
      productos.forEach((producto) => {
        total += producto.precio * producto.cantidad;
        cantidadTotal += producto.cantidad;
      });

      // Setear envioGratis en true o false según el total
      if (total > 10000) {
        envioGratis = true;
      }
    }
    // Actualiza los campos del carrito de compras
    carrito.productos = productos || carrito.productos;
    carrito.total = total;
    carrito.cantidadProductos = cantidadTotal;
    carrito.envioGratis = envioGratis;
    // Guarda los cambios en la base de datos
    await carrito.save();

    return res.status(200).json(carrito); // Devuelve el carrito actualizado
  } catch (error) {
    console.error("Error al editar el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarCarritoDeCompras = async (req, res) => {
  try {
    const { id } = req.params; // Obtén el ID del usuario de los parámetros de la ruta

    // Verifica si el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Busca y elimina el carrito de compras del usuario
    const resultado = await Cart.destroy({ where: { id } });
    if (resultado === 0) {
      return res
        .status(404)
        .json({ error: "Carrito de compras no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Carrito de compras eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const vaciarCarritoDeCompras = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    // Verifica si el usuario existe
    const usuario = await Usuario.findByPk(decodedToken.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Busca el carrito de compras del usuario
    let carrito = await Cart.findOne({ where: { usuarioId: decodedToken.id } });
    if (!carrito) {
      return res
        .status(404)
        .json({ error: "Carrito de compras no encontrado" });
    }

    // Elimina todos los productos del carrito
    await carrito.update({ productos: [], total: 0, cantidadProductos: 0, envioGratis: false });

      return res.status(200).json({ message: "Carrito de compras vaciado exitosamente", carritoVacio: carrito });
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};