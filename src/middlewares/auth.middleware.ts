import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";
import UserModel from "../models/User.model";

/**
 * Attaches decoded token to req.user
 */
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: true, message: "Unauthorized access" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ error: true, message: "Invalid authorization format" });

  const token = parts[1];
  try {
    const decoded = verifyToken(token);
    // attach to req
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: true, message: "Forbidden access" });
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user?.email) {
    return res.status(403).json({ error: true, message: "Forbidden access" });
  }
  const dbUser = await UserModel.findOne({ email: user.email });
  if (dbUser?.role !== "Admin") {
    return res.status(403).json({ error: true, message: "Forbidden access" });
  }
  next();
};
