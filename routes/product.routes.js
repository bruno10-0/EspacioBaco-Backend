import { Router } from "express";
import {
  getProducts,
  postProduct,
  putProduct,
  deleteProduct,
  getProductById,
} from "../controllers/product.controllers.js";

const router = Router();

router.get("/products",getProducts);

router.post("/product/:id",getProductById);

router.post("/product",postProduct);

router.put("/product/:id",putProduct);

router.delete("/product/:id",deleteProduct);

export default router;
