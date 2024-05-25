import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";
import { Usuario } from "../models/user.model.js";

export const Order = sequelize.define("Orden", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: "id",
    },
    allowNull: false,
  },
  listaProductos: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true,
    defaultValue: [],
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  pago: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  metodoDePago: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Indefinido",
  },
  envios:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
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

// Sincroniza el modelo Ordenes con la base de datos
Order.sync({ alter: true })
  .then(() => {
    console.log(
      'Modelo "Ordenes" sincronizado correctamente con la base de datos.'
    );
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo "Ordenes":', error);
  });
