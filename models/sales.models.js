import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";

export const Sales = sequelize.define("Ventas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ordenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productos: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    defaultValue: [], // Array vacío por defecto
  },
  total: {
    type: DataTypes.DECIMAL(10, 2), // Ajusta según tus necesidades de precisión
    defaultValue: 0,
  },
  metodoDePago: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Indefinido",
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

Sales.sync({ alter: true })
  .then(() => {
    console.log(
      'Modelo "Ventas" sincronizado correctamente con la base de datos.'
    );
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo "Ventas":', error);
  });
