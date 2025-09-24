import { Router } from "express";
import { getUsers, deleteUser, makeAdmin, isAdmin, updateProfile } from "../controllers/users.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyJWT, verifyAdmin, getUsers);
router.delete("/:id", verifyJWT, verifyAdmin, deleteUser);
router.patch("/admin/:id", verifyJWT, verifyAdmin, makeAdmin);
router.get("/admin/:email", verifyJWT, isAdmin);
router.put("/profile", verifyJWT, updateProfile);

export default router;
