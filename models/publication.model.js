import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize.js";

export const Publication = sequelize.define("Publicaciones", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
  },
  secureURL1: {
    type: DataTypes.STRING,
  },
  publicID1: {
    type: DataTypes.STRING,
  },
  secureURL2: {
    type: DataTypes.STRING,
  },
  publicID2: {
    type: DataTypes.STRING,
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

// Sincroniza el modelo Publicacion con la base de datos
Publication.sync({ alter: true })
  .then(() => {
    console.log(
      'Modelo "Publicación" sincronizado correctamente con la base de datos.'
    );
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo "Publicación":', error);
  });
