import { Router } from "express";
import asyncWrapper from "../utils/async-wrapper";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getMyListings, submitListing } from "../controllers/listing.controller";

const router = Router();
router.use(verifyJWT);
router.get("/mine", asyncWrapper(getMyListings));
router.post("/", asyncWrapper(submitListing));

export default router;