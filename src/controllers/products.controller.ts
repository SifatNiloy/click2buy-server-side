import { Request, Response } from "express";
import ProductModel from "../models/Product.model";

export const getLimitedProducts = async (req: Request, res: Response) => {
  const products = await ProductModel.find().skip(10).limit(8);
  res.json(products);
};

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 0;
  const size = parseInt(req.query.size as string) || 10;
  const products = await ProductModel.find().skip(page * size).limit(size);
  const count = await ProductModel.estimatedDocumentCount();
  res.json({ count, products });
};

export const searchProducts = async (req: Request, res: Response) => {
  const name = req.params.name;
  const regex = new RegExp(name, "i");
  const results = await ProductModel.find({ name: regex });
  res.json(results);
};

export const addProduct = async (req: Request, res: Response) => {
  const product = req.body;
  const created = await ProductModel.create(product);
  res.status(201).json(created);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  await ProductModel.deleteOne({ _id: id });
  res.json({ success: true });
};
