import { Schema, model } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  description?: string;
  image?: string;
  // add fields as required
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String
}, { timestamps: true });

const ProductModel = model<IProduct>("Product", ProductSchema);
export default ProductModel;
