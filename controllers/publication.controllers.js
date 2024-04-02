import { Publication } from "../models/publication.model.js"; // Importa el modelo de Publicaciones
import {
  subirImagenPublicacion,
  borrarImagenesPublicacion,
} from "../utils/cloudinary.js"; // Importa la función para subir imágenes a Cloudinary
import fs from "fs-extra"; // Importa el módulo fs-extra para manipulación de archivos

// Controlador para traer los datos y 2 imagenes
export const getImagenes = async (req, res) => {
  try {
    // Consulta todos los registros de la tabla Publication
    const publicaciones = await Publication.findAll();

    // Verifica si se encontraron registros
    if (publicaciones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron publicaciones" });
    }

    // Responde con los registros encontrados
    res.status(200).json({ publicaciones });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso y responde con un mensaje de error
    console.error("Error al obtener las publicaciones:", error);
    res.status(500).json({ error: "Error al obtener las publicaciones" });
  }
};
// Controlador para crear una nueva publicación con dos imágenes
export const createPublication = async (req, res) => {
  const { titulo } = req.body; // Obtiene el título de la publicación desde el cuerpo de la solicitud

  // Verifica si no se recibieron ambas imágenes en la solicitud
  if (!req.files?.imagen1 || !req.files?.imagen2) {
    return res
      .status(400)
      .json({ error: "No se recibieron ambas imágenes en la solicitud" });
  }

  // Crea una nueva instancia de Publicaciones con el título proporcionado
  const publicacion = Publication.build({
    titulo: titulo,
  });

  try {
    // Sube la primera imagen a Cloudinary y guarda la URL y el ID público en la instancia de Publicaciones
    const respuestaImagen1 = await subirImagenPublicacion(
      req.files.imagen1.tempFilePath
    );
    publicacion.secureURL1 = respuestaImagen1.secure_url;
    publicacion.publicID1 = respuestaImagen1.public_id;

    // Sube la segunda imagen a Cloudinary y guarda la URL y el ID público en la instancia de Publicaciones
    const respuestaImagen2 = await subirImagenPublicacion(
      req.files.imagen2.tempFilePath
    );
    publicacion.secureURL2 = respuestaImagen2.secure_url;
    publicacion.publicID2 = respuestaImagen2.public_id;

    // Elimina el archivo temporal de la imagen después de subirla a Cloudinary
    await fs.unlink(req.files.imagen1.tempFilePath);
    await fs.unlink(req.files.imagen2.tempFilePath);

    // Guarda la instancia de Publicaciones en la base de datos
    await publicacion.save();

    // Responde con un mensaje de éxito
    res
      .status(200)
      .json({
        message: "Publicación creada y guardada en la base de datos"
      });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso y responde con un mensaje de error
    console.error(
      "Error al guardar la publicación en la base de datos:",
      error
    );
    res
      .status(500)
      .json({ error: "Error al guardar la publicación en la base de datos" });
  }
};
// Controlador para crear eliminar dos imágenes
export const borrarImagenes = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca la publicación por su ID
    const publicacion = await Publication.findOne({ where: { id } });

    // Verifica si la publicación existe
    if (!publicacion) {
      console.log(`La publicación con el ID: ${id} no existe`);
      return res
        .status(404)
        .json({ message: `La publicación con el ID: ${id} no existe` });
    }

    // Elimina las imágenes de Cloudinary
    await borrarImagenesPublicacion(
      publicacion.publicID1,
      publicacion.publicID2
    );

    // Elimina la publicación de la base de datos
    await publicacion.destroy();

    // Responde con un mensaje de éxito
    res
      .status(200)
      .json({ message: "Publicación eliminada con éxito de la base de datos" });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso y responde con un mensaje de error
    console.error("Error al eliminar la publicación:", error);
    res.status(500).json({ error: "Error al eliminar la publicación" });
  }
};
// Controlador para Editar una publicacion.
export const editarPublicacion = async (req, res) => {
  try {
    // Extraemos el ID de la publicacion a editar.
    const { id } = req.params;

    // Busca la publicación por su ID
    let publicacion = await Publication.findByPk(id);

    // Verifica si la publicación existe
    if (!publicacion) {
      return res.status(404).json({ error: "La publicación no existe" });
    }

    // Extraemos el dato de "titulo" de req.body
    const { titulo } = req.body;

    // Verifica si se recibieron ambas imágenes en la solicitud
    if (!req.files?.imagen1 || !req.files?.imagen2) {
      return res
        .status(400)
        .json({ error: "No se recibieron ambas imágenes en la solicitud" });
    }

    // Elimina las imágenes antiguas de Cloudinary
    await borrarImagenesPublicacion(
      publicacion.publicID1,
      publicacion.publicID2
    );

    // Sube la primera imagen a Cloudinary y guarda la URL y el ID público en la instancia de Publicaciones
    const respuestaImagen1 = await subirImagenPublicacion(
      req.files.imagen1.tempFilePath
    );
    publicacion.secureURL1 = respuestaImagen1.secure_url;
    publicacion.publicID1 = respuestaImagen1.public_id;

    // Sube la segunda imagen a Cloudinary y guarda la URL y el ID público en la instancia de Publicaciones
    const respuestaImagen2 = await subirImagenPublicacion(
      req.files.imagen2.tempFilePath
    );
    publicacion.secureURL2 = respuestaImagen2.secure_url;
    publicacion.publicID2 = respuestaImagen2.public_id;

    // Elimina el archivo temporal de la imagen después de subirla a Cloudinary
    await fs.unlink(req.files.imagen1.tempFilePath);
    await fs.unlink(req.files.imagen2.tempFilePath);

    //ponemos el nuevo titulo
    publicacion.titulo = titulo;

    // Guarda la instancia de Publicaciones en la base de datos
    await publicacion.save();

    // Responde con un mensaje de éxito
    res.status(200).json({ message: "Publicación editada con éxito" });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso y responde con un mensaje de error
    console.error("Error al editar la publicación:", error);
    res.status(500).json({ error: "Error al editar la publicación" });
  }
};
