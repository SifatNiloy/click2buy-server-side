import { Router } from "express";
import asyncWrapper from "../utils/async-wrapper";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware";
import {
  getLimitedProducts,
  getProducts,
  searchProducts,
  addProduct,
  deleteProduct,
  getProductById,
  updateProduct
} from "../controllers/products.controller";

const router = Router();

// public
router.get("/featuredProducts", asyncWrapper(getLimitedProducts));
router.get("/", asyncWrapper(getProducts));
router.get("/search/:name", asyncWrapper(searchProducts));
router.get("/single/:id", asyncWrapper(getProductById));

// admin-protected
router.post("/", verifyJWT, verifyAdmin, asyncWrapper(addProduct));
router.put("/:id", verifyJWT, verifyAdmin, asyncWrapper(updateProduct));
router.delete("/:id", verifyJWT, verifyAdmin, asyncWrapper(deleteProduct));

export default router;
