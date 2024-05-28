import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

//CONTROLADOR PARA OBTENER TODAS LAS ORDENES BRO
export const getAllOrders = async (req, res) => {
  try {
    // Obtener todas las órdenes de la base de datos
    const orders = await Order.findAll();

    // Verificar si se encontraron órdenes
    if (orders.length === 0) {
      return res.status(404).json({ message: "No se encontraron órdenes." });
    }

    // Respuesta con las órdenes encontradas
    res.status(200).json({ orders });
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

//CONTROLADOR PARA CREAR UNA ORDEN BRO
export const createOrder = async (req, res) => {
  try {
    const { total, idUsuario, listaProductos, estado, metodoDePago, envios } =
      req.body;

    // Crear la nueva orden en la base de datos
    const newOrder = await Order.create({
      idUsuario,
      listaProductos,
      estado: estado,
      total: total,
      metodoDePago: metodoDePago,
      pago: false,
      envios,
    });

    // Actualizar el stock de los productos
    for (const product of listaProductos) {
      try {
        // Buscar el producto en el modelo Product
        const foundProduct = await Product.findOne({
          where: { id: product.id },
        });

        if (foundProduct) {
          // Restar la cantidad de productos reservados del stock disponible
          foundProduct.stock -= product.cantidad;
          await foundProduct.save();
        }
      } catch (error) {
        // Manejar errores en la búsqueda o actualización del producto
        console.error("Error al buscar o actualizar el producto:", error);
      }
    }

    res
      .status(201)
      .json({ message: "Orden creada exitosamente", order: newOrder });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//CONTROLADOR PARA OBTENER UNA ORDEN ESPECIFICA BRO
export const getOrderForUserId = async (req, res) => {
  const { id, token } = req.body;

  let idUser;

  if (id) {
    idUser = id;
  } else if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      idUser = decodedToken.id;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "El token ha expirado" });
      } else {
        return res.status(400).json({ message: "Token inválido" });
      }
    }
  } else {
    return res
      .status(400)
      .json({ message: "Se requiere proporcionar id o token" });
  }

  try {
    // Buscar la orden en la base de datos
    const orden = await Order.findOne({
      where: { idUsuario: idUser },
    });

    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Devolver la orden encontrada
    return res.status(200).json(orden);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//CONTROLADOR PARA ELIMINAR UNA ORDEN ESPECIFICA EN BASE  AL ID DEL USUARIO BRO
export const deleteOrderByUserId = async (req, res) => {
  const { token } = req.body;
  let idUser;

  if (!token) {
    console.log("Error, no se puede proceder, no hay token.");
    return res
      .status(400)
      .json({ message: "Error, no se puede proceder, no hay token." });
  }

  try {
    const decodedToken = jwt.verify(token.token, process.env.TOKEN_SECRET);
    idUser = decodedToken.id;
    // Buscar la orden del usuario
    const order = await Order.findOne({ where: { idUsuario: idUser } });

    if (!order) {
      return res
        .status(404)
        .json({ message: "No se encontró ninguna orden para este usuario" });
    }
    // Recorrer la lista de productos de la orden
    for (const product of order.listaProductos) {
      try {
        // Buscar el producto en el modelo Product
        const foundProduct = await Product.findOne({
          where: { id: product.id },
        });

        if (foundProduct) {
          // Actualizar el stock del producto
          foundProduct.stock += product.cantidad;
          await foundProduct.save();
        }
      } catch (error) {
        // Manejar errores en la búsqueda o actualización del producto
        console.error("Error al buscar o actualizar el producto:", error);
      }
    }

    // Ahora que se ha actualizado el stock de los productos, proceder a eliminar la orden
    await Order.destroy({ where: { idUsuario: idUser } });

    return res
      .status(200)
      .json({ message: "Stock actualizado y orden eliminada exitosamente" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    } else {
      return res.status(400).json({ message: "Token inválido" });
    }
  }
};

export const deleteOrderByClientId = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    console.log("Error, no se puede proceder, no hay token.");
    return res
      .status(400)
      .json({ message: "Error, no se puede proceder, no hay token." });
  }

  try {
    const order = await Order.findOne({ where: { idUsuario: id } });
    if (!order) {
      return res
        .status(404)
        .json({ message: "No se encontró ninguna orden para este usuario" });
    }

    for (const product of order.listaProductos) {
      try {
        // Buscar el producto en el modelo Product
        const foundProduct = await Product.findOne({
          where: { id: product.id },
        });

        if (foundProduct) {
          // Actualizar el stock del producto
          foundProduct.stock += product.cantidad;
          await foundProduct.save();
        }
      } catch (error) {
        // Manejar errores en la búsqueda o actualización del producto
        console.error("Error al buscar o actualizar el producto:", error);
      }
    }

    // Ahora que se ha actualizado el stock de los productos, proceder a eliminar la orden
    await Order.destroy({ where: { idUsuario: id } });

    return res
      .status(200)
      .json({ message: "Stock actualizado y orden eliminada exitosamente" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    } else {
      return res.status(400).json({ message: "Token inválido" });
    }
  }
};
