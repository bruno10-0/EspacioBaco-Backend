import { Sales } from "../models/sales.models.js";
import { Usuario } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
export const getVentas = async (req, res) => {
  try {
    const ventas = await Sales.findAll();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
};

export const createVenta = async (req, res) => {
  const { metodoDePago, usuarioId, productos, total, ordenId } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Crear una nueva venta
    const nuevaVenta = await Sales.create({
      ordenId,
      metodoDePago,
      usuarioId,
      productos,
      total,
    });

    // Destruir la orden después de registrar la venta
    const ordenEliminada = await Order.destroy({ where: { id: ordenId } });
    if (!ordenEliminada) {
      return res
        .status(404)
        .json({ error: "Orden no encontrada para eliminar" });
    }

    res.status(201).json(nuevaVenta); // Responder con la venta creada
  } catch (error) {
    console.error("Error al crear la venta:", error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
};
