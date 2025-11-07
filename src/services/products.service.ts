import { ProductModel } from "../models/Product.model";
import { Product } from "../models/Product.model";

export async function createProduct(data: Partial<Product>) {
  return ProductModel.create(data);
}

export async function findProductById(id: string) {
  return ProductModel.findById(id);
}

export async function findProducts(page: number, size: number) {
  const products = await ProductModel.find().skip((page - 1) * size).limit(size).sort({ createdAt: -1 });
  const count = await ProductModel.estimatedDocumentCount();
  return { products, count };
}

export async function findLimitedProducts(skip = 10, limit = 8) {
  return ProductModel.find().skip(skip).limit(limit);
}

export async function searchProductsByName(nameRegex: RegExp) {
  return ProductModel.find({ name: nameRegex });
}

export async function updateProductById(id: string, payload: Partial<Product>) {
  return ProductModel.findByIdAndUpdate(id, payload, { new: true });
}

export async function deleteProductById(id: string) {
  return ProductModel.deleteOne({ _id: id });
}
