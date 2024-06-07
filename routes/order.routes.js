import { Router } from "express";

import {
  getAllOrders,
  createOrder,
  deleteOrderByUserId,
  getOrderForUserId,
  deleteOrderByClientId,
  getOrderById
} from "../controllers/order.controllers.js";
const router = Router();

router.get("/orden", getAllOrders);

router.get("/orden/:id", getOrderById);

router.post("/ordenById", getOrderForUserId);

router.post("/orden", createOrder);

router.delete("/ordenUser", deleteOrderByUserId);

router.delete("/ordenClient", deleteOrderByClientId);

export default router;