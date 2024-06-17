import { Router } from "express";

import {
  crearUsuario,
  crearUsuarioPorAdmin,
  editarUsuario,
  eliminarUsuario,
  eliminarUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarios,
  iniciarSesion,
  verificarToken,
  editMyUser,
} from "../controllers/user.controllers.js";
import { validateTokenAdmin } from "../middlewares/validateTokenAdmin.js";

const router = Router();

router.get("/usuarios", validateTokenAdmin, obtenerUsuarios);

router.post("/usuarios", crearUsuario);
router.post("/AdminUsuarios", validateTokenAdmin, crearUsuarioPorAdmin); //Ruta para que usuarios admin creen otros usuarios, Admins o Normales.
router.post("/iniciar-sesion", iniciarSesion);
// Rutas para obtener, editar y eliminar un usuario por su ID
router.get("/usuarios/:id", validateTokenAdmin, obtenerUsuarioPorId);
router.put("/usuarios/:id", editarUsuario);
router.put("/usuario", editMyUser);
router.delete("/usuarios/:id", validateTokenAdmin, eliminarUsuario);

// Ruta para eliminar múltiples usuarios
router.delete("/usuarios", validateTokenAdmin, eliminarUsuarios);

//Ruta para verificar el Token de el frontend
router.post("/verificar", verificarToken);
export default router;
