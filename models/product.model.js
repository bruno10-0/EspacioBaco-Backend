import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";

export const Product = sequelize.define("Producto", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreBodega: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion_detallada: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descripcion_corta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  año: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maridaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
    defaultValue:
      "https://images.vexels.com/media/users/3/215895/isolated/preview/36ec60399b703a700d20bec25f1c2ce8-botella-de-vino-y-trazo-de-vidrio.png",
    allowNull: true, // Permitir nulos si no todas las entradas tienen imágenes
  },
  public_id: {
    type: DataTypes.STRING,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
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

// Sincroniza el modelo Producto con la base de datos
Product.sync({ alter: true })
  .then(() => {
    console.log(
      'Modelo "Producto" sincronizado correctamente con la base de datos.'
    );
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo "Producto":', error);
  });
