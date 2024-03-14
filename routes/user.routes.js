import { Router } from "express";

import {
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  eliminarUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarios,
  iniciarSesion,
  cerrarSesion,
} from "../controllers/user.controllers.js";

const router = Router();

router.get("/usuarios", obtenerUsuarios);

router.post("/usuarios", crearUsuario);
router.post("/iniciar-sesion", iniciarSesion);
router.post("/cerrar-sesion", cerrarSesion);
// Rutas para obtener, editar y eliminar un usuario por su ID
router.get("/usuarios/:id", obtenerUsuarioPorId);
router.put("/usuarios/:id", editarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

// Ruta para eliminar múltiples usuarios
router.delete("/usuarios", eliminarUsuarios);

export default router;
