import { Request, Response } from "express";
import UserModel from "../models/User.model";
import { updateProfileSchema } from "../schemas/user.schema";
import { ObjectId } from "mongoose";

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find();
  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  await UserModel.deleteOne({ _id: id });
  res.json({ success: true });
};

export const makeAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserModel.findByIdAndUpdate(id, { role: "Admin" }, { new: true });
  res.json(user);
};

export const isAdmin = async (req: Request, res: Response) => {
  const email = req.params.email;
  const requester = (req as any).user;
  if (!requester || requester.email !== email) return res.json({ admin: false });

  const user = await UserModel.findOne({ email });
  res.json({ admin: user?.role === "Admin" });
};

export const updateProfile = async (req: Request, res: Response) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const requester = (req as any).user;
  if (!requester?._id) return res.status(403).json({ message: "Unauthorized user" });

  const updated = await UserModel.findByIdAndUpdate(requester._id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(updated);
};
