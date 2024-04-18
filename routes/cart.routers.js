import { Router } from "express";
import {
  crearCarritoDeCompras,
  editarCarritoDeCompras,
  eliminarCarritoDeCompras,
} from "../controllers/cart.controllers.js";
const router = Router();

router.post("/carrito", crearCarritoDeCompras);

router.put("/carrito", editarCarritoDeCompras);

router.delete("/carrito/:id", eliminarCarritoDeCompras);

export default router;
