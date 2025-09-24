import { Request, Response } from "express";
import UserModel from "../models/User.model";
import { signToken } from "../utils/jwt.util";
import { createUserSchema } from "../schemas/user.schema";

export const createJwt = (req: Request, res: Response) => {
  const payload = req.body;
  const token = signToken(payload as Record<string, any>);
  res.json({ token });
};

export const registerUser = async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const user = parsed.data;
  const existing = await UserModel.findOne({ email: user.email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const created = await UserModel.create(user);
  res.status(201).json(created);
};
