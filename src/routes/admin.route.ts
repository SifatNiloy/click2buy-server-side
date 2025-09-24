import { Router } from "express";
import { adminStats } from "../controllers/admin.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/stats", verifyJWT, verifyAdmin, adminStats);

export default router;
