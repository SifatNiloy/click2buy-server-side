import { Router } from "express";
import { getOrders, postOrder, getOrderById, deleteOrder } from "../controllers/orders.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyJWT, getOrders);
router.post("/", postOrder);
router.get("/:id", getOrderById);
router.delete("/:id", deleteOrder);

export default router;
