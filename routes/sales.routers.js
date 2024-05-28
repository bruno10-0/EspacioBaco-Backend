import { Router } from "express";
import { getVentas, createVenta } from "../controllers/sales.controllers.js";

const router = Router();

router.get("/sales", getVentas);
router.post("/sales", createVenta);
export default router;
