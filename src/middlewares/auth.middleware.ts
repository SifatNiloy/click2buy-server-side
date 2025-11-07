import { Request, Response, NextFunction } from "express";
import admin from "../utils/firebaseAdmin";
import UserModel from "../models/User.model";

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: true, message: "Unauthorized access" });

  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ error: true, message: "Invalid authorization format" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    (req as any).user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.displayName,
      picture: decoded.picture,
    };

    // Upsert user in DB
    const dbUser = await UserModel.findOneAndUpdate(
      { email: decoded.email },
      {
        $set: { displayName: decoded.name || decoded.displayName },
        $setOnInsert: { role: "User" },
      },
      { upsert: true, new: true }
    );

    (req as any).user._id = dbUser._id;
    next();
  } catch (err) {
    console.error("Firebase token verification error:", err);
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
