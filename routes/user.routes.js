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
  verificarToken,
} from "../controllers/user.controllers.js";
import { validateTokenAdmin } from "../middlewares/validateTokenAdmin.js";
const router = Router();

router.get("/usuarios", validateTokenAdmin, obtenerUsuarios);

router.post("/usuarios", crearUsuario);
router.post("/iniciar-sesion", iniciarSesion);
router.post("/cerrar-sesion", cerrarSesion);
// Rutas para obtener, editar y eliminar un usuario por su ID
router.get("/usuarios/:id", validateTokenAdmin, obtenerUsuarioPorId);
router.put("/usuarios/:id", editarUsuario);
router.delete("/usuarios/:id", validateTokenAdmin, eliminarUsuario);

// Ruta para eliminar múltiples usuarios
router.delete("/usuarios", validateTokenAdmin, eliminarUsuarios);

//Ruta para verificar el Token de el frontend
router.post("/verificar", verificarToken);
export default router;
