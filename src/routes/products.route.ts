import { Router } from "express";
import {
  getLimitedProducts,
  getProducts,
  searchProducts,
  addProduct,
  deleteProduct
} from "../controllers/products.controller";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.get("/limitedProduct", getLimitedProducts);
router.get("/", getProducts);
router.get("/search/:name", searchProducts);
router.post("/", verifyJWT, verifyAdmin, addProduct);
router.delete("/:id", verifyJWT, verifyAdmin, deleteProduct);

export default router;
