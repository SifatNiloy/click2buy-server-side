import { Router } from "express";
import asyncWrapper from "../utils/async-wrapper";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";
import {
  postOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
  getOrderStats
} from "../controllers/orders.controller";

const router = Router();

router.post("/", asyncWrapper(postOrder));

// for authenticated user: view own orders
router.get("/", verifyJWT, asyncWrapper(getOrders));
router.get("/:id", verifyJWT, asyncWrapper(getOrderById));

// for admin: manage all orders
router.put("/:id/status", verifyJWT, verifyAdmin, asyncWrapper(updateOrderStatus));
router.delete("/:id", verifyJWT, verifyAdmin, asyncWrapper(deleteOrder));
router.get("/stats/all", verifyJWT, verifyAdmin, asyncWrapper(getOrderStats));

export default router;
