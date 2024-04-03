import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export async function subirImagenPublicacion(ruta) {
  return await cloudinary.uploader.upload(ruta, {
    folder: "espacioBacoImganes/publicacion",
  });
}

export async function borrarImagenesPublicacion(public_id1, public_id2) {
  await cloudinary.uploader.destroy(public_id1);
  await cloudinary.uploader.destroy(public_id2);
  return;
}

export async function subirImagenProducto(ruta) {
  return await cloudinary.uploader.upload(ruta, {
    folder: "espacioBacoImganes/producto",
  });
}