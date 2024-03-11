import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import indexRouter from "./routes/index.routes.js";
import product from "./routes/product.routes.js";
import user from "./routes/user.routes.js"


// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Define el puerto en el que se ejecutará el servidor
const port = process.env.PORT;

// Inicializa una instancia de Express
const app = express();

// Middleware para parsear los datos entrantes en formato JSON
app.use(express.json());

// Middleware para habilitar la comunicación entre servidores (CORS)
app.use(cors());

// Middleware para el registro de solicitudes HTTP (solicitudes de desarrollo)
app.use(morgan("dev"));

// Rutas principales de la aplicación
app.use(indexRouter); // Rutas principales
app.use(product); // Rutas relacionadas con los productos
app.use(user); // Rutas relacionadas con los usuarios

// Inicia el servidor y lo hace escuchar en el puerto especificado
app.listen(port, () => {
  console.log(
    `El servidor está funcionando en el puerto http://localhost:${port}`
  );
});
