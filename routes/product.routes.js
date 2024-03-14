import { Router } from "express";
import {
  getProducts,
  postProduct,
  putProduct,
  deleteProduct,
  getProductById,
} from "../controllers/product.controllers.js";
import { validateTokenAdmin } from "../middlewares/validateTokenAdmin.js";

const router = Router();

router.get("/products", getProducts);

router.post("/product/:id", getProductById);

router.post("/product", validateTokenAdmin, postProduct);

router.put("/product/:id", validateTokenAdmin, putProduct);

router.delete("/product/:id", validateTokenAdmin, deleteProduct);

export default router;
