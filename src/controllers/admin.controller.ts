import { Request, Response } from "express";
import UserModel from "../models/User.model";
import ProductModel from "../models/Product.model";
import OrderModel from "../models/Order.model";

export const adminStats = async (req: Request, res: Response) => {
  const users = await UserModel.estimatedDocumentCount();
  const products = await ProductModel.estimatedDocumentCount();
  const orders = await OrderModel.estimatedDocumentCount();

  const ordersList = await OrderModel.find();
  const totalPrice = ordersList.reduce((sum, o) => sum + (o.price || 0), 0);

  res.json({ users, products, orders, totalPrice });
};
