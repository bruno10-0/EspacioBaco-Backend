import { Router } from "express";

import {
  getAllOrders,
  createOrder,
  deleteOrderByUserId,
  getOrderForUserId,
} from "../controllers/order.controllers.js";
const router = Router();

router.get("/orden", getAllOrders);

router.post("/ordenById", getOrderForUserId);

router.post("/orden", createOrder);

router.delete("/orden", deleteOrderByUserId);

export default router;