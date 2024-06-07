import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";
import {Usuario} from "./user.model.js"

export const Cart = sequelize.define("Carrito", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productos: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    defaultValue: [], // Array vacío por defecto
  },
  cantidadProductos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2), // Ajusta según tus necesidades de precisión
    defaultValue: 0,
  },
  envioGratis: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Sincroniza el modelo carrito con la base de datos
Cart.sync({ alter: true })
  .then(() => {
    console.log(
      'Modelo "Carrito" sincronizado correctamente con la base de datos.'
    );
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo "Carrito":', error);
  });
