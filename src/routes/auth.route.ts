import { Router } from "express";
import { createJwt, registerUser } from "../controllers/auth.controller";

const router = Router();

router.post("/jwt", createJwt);
router.post("/users", registerUser);

export default router;
