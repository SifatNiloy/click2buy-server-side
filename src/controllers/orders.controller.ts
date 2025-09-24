import { Request, Response } from "express";
import OrderModel from "../models/Order.model";

export const getOrders = async (req: Request, res: Response) => {
  const email = req.query.email as string | undefined;
  if (!email) return res.json([]);

  const requester = (req as any).user;
  if (!requester || requester.email !== email) return res.status(403).json({ error: true, message: "forbidden access" });

  const orders = await OrderModel.find({ email });
  res.json(orders);
};

export const postOrder = async (req: Request, res: Response) => {
  const order = req.body;
  const created = await OrderModel.create(order);
  res.status(201).json(created);
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const order = await OrderModel.findById(id);
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  await OrderModel.deleteOne({ _id: id });
  res.json({ success: true });
};
