import fileUpload from "express-fileupload";
import { Router } from "express";
import {
  getProducts,
  postProduct,
  putProduct,
  deleteProduct,
  getProductById,
  eliminarProductos
} from "../controllers/product.controllers.js";
import { validateTokenAdmin } from "../middlewares/validateTokenAdmin.js";

const router = Router();

router.get("/products", getProducts);

router.post("/product/:id", getProductById);

router.post("/product", validateTokenAdmin,fileUpload({useTempFiles : true,tempFileDir : './temp'}),postProduct);

router.put("/product/:id", validateTokenAdmin, putProduct);

router.delete("/product/:id", validateTokenAdmin, deleteProduct);

router.delete("/products", validateTokenAdmin, eliminarProductos);
export default router;
