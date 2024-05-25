import { Router } from "express";
import {
  crearCarritoDeCompras,
  editarCarritoDeCompras,
  eliminarCarritoDeCompras,
  vaciarCarritoDeCompras,
} from "../controllers/cart.controllers.js";
const router = Router();

router.post("/carrito", crearCarritoDeCompras);

router.put("/carrito", editarCarritoDeCompras);

router.delete("/carrito/:id", eliminarCarritoDeCompras);

router.delete("/carrito", vaciarCarritoDeCompras);


export default router;
