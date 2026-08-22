import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route";
import usersRoutes from "./routes/users.route";
import productsRoutes from "./routes/products.route";
import ordersRoutes from "./routes/orders.route";
import adminRoutes from "./routes/admin.route";
import listingRoutes from "./routes/listing.route";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/listings", listingRoutes);

// health
app.get("/", (req, res) => res.send("click2buy server connected"));

// error handler (last)
app.use(errorHandler);

export default app;
