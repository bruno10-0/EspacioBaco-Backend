import { Product } from "../models/product.model.js";
import fs from "fs-extra";
import { subirImagenProducto } from "../utils/cloudinary.js";
export const getProducts = async (req, res) => {
  try {
    // Busca todos los productos en la base de datos
    const productos = await Product.findAll();

    // Si no se encontraron productos, devuelve un mensaje de error
    if (!productos || productos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron productos" });
    }

    // Si se encontraron productos, los devuelve en formato JSON
    res.status(200).json(productos);
  } catch (error) {
    // Si ocurre un error durante la búsqueda de productos, devuelve un mensaje de error
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Obtiene el ID del producto de los parámetros de la solicitud

    // Busca el producto por su ID
    const producto = await Product.findByPk(id);

    // Si el producto no se encuentra, devuelve un mensaje de error
    if (!producto) {
      return res
        .status(404)
        .json({ mensaje: "Producto no encontrado", productoEncontrado: false });
    }

    // Si el producto se encuentra, lo devuelve en formato JSON
    res.json(producto);
  } catch (error) {
    // Maneja los posibles errores que puedan ocurrir durante la búsqueda del producto
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const postProduct = async (req, res) => {
  try {
    // Desestructura los datos recibidos con los nombres de los campos del modelo Producto
    const {
      nombre,
      nombreBodega,
      descripcion_detallada,
      descripcion_corta,
      precio,
      stock,
      tipo,
    } = req.body;

    if (!req.files?.imagen) {
      return res
        .status(400)
        .json({ error: "No se recibió una imágen en la solicitud" });
    }

    const producto = Product.build({
      nombre: nombre,
      nombreBodega: nombreBodega,
      descripcion_detallada: descripcion_detallada,
      descripcion_corta: descripcion_corta,
      precio: precio,
      stock: stock,
      tipo: tipo,
    });

    try {
      const respuestaImagen = await subirImagenProducto(
        req.files.imagen.tempFilePath
      );
      producto.imagen = respuestaImagen.secure_url;
      producto.public_id = respuestaImagen.public_id;

      await fs.unlink(req.files.imagen.tempFilePath);

      await producto.save();

      // Si el producto se crea exitosamente, devuelve el producto creado en formato JSON

      res.status(201).json({ mensaje: "Producto creado exitosamente" });
    } catch (error) {
      // Si ocurre un error durante la creación del producto, maneja los posibles errores
      console.error(
        "Error al guardar el Producto en la base de datos:",
        error
      );
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Si hay errores de validación, devuelve un mensaje de error con los detalles de validación
      const errores = error.errors.map((err) => ({
        campo: err.path,
        mensaje: err.message,
      }));
      res.status(400).json({ errores });
    } else {
      // Si ocurre otro tipo de error, devuelve un mensaje de error genérico
      console.error("Error al crear producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};
export const putProduct = async (req, res) => {
  const { id } = req.params; // Obtiene el ID del producto a editar de los parámetros de la solicitud
  try {
    // Busca el producto por su ID
    const producto = await Product.findByPk(id);

    // Si no se encuentra el producto, devuelve un mensaje de error
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Actualiza el producto con los datos recibidos en la solicitud
    await producto.update(req.body);

    // Devuelve el producto actualizado en formato JSON
    res.json(producto);
  } catch (error) {
    // Si ocurre un error durante la actualización del producto, maneja los posibles errores
    if (error.name === "SequelizeValidationError") {
      // Si hay errores de validación, devuelve un mensaje de error con los detalles de validación
      const errores = error.errors.map((err) => ({
        campo: err.path,
        mensaje: err.message,
      }));
      res.status(400).json({ errores });
    } else {
      // Si ocurre otro tipo de error, devuelve un mensaje de error genérico
      console.error("Error al editar producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params; // Obtiene el ID del producto a eliminar de los parámetros de la solicitud
  try {
    // Busca el producto por su ID
    const producto = await Product.findByPk(id);

    // Si no se encuentra el producto, devuelve un mensaje de error
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Elimina el producto de la base de datos
    await producto.destroy();

    // Devuelve un mensaje indicando que el producto se eliminó correctamente
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    // Maneja los posibles errores durante la eliminación del producto
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
