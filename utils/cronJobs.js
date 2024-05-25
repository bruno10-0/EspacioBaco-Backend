import cron from "node-cron";
import { Op } from "sequelize";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

// Función para verificar y cancelar órdenes vencidas
const checkAndCancelExpiredOrders = async () => {
  try {
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.lte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Órdenes creadas hace más de 24 horas
        },
      },
    });

    // Retornar en caso de que no existan órdenes vencidas
    if (!orders.length) {
      console.log("No hay órdenes vencidas.");
      return;
    }

    for (const order of orders) {
      for (const productItem of order.listaProductos) {
        const product = await Product.findOne({ where: { id: productItem.id } });

        if (product) {
          await Product.update(
            { stock: product.stock + productItem.cantidad },
            { where: { id: product.id } }
          );
        } else {
          console.error(`Producto con ID ${productItem.id} no encontrado.`);
        }
      }
      // Eliminar la orden
      await Order.destroy({ where: { id: order.id } });
    }

    console.log(`Canceladas y eliminadas ${orders.length} órdenes vencidas.`);
  } catch (error) {
    console.error("Error al cancelar y eliminar órdenes vencidas:", error);
  }
};

export const scheduleExpiredOrdersCheck = () => {
  cron.schedule("0 * * * *", () => {
    console.log("Buscando órdenes vencidas...");
    checkAndCancelExpiredOrders();
  });
};
