import { Schema, model } from "mongoose";

export interface IOrder {
  email: string;
  items: Array<{ productId: string; name?: string; price?: number; qty?: number }>;
  price: number;
  status?: string;
}

const OrderSchema = new Schema<IOrder>({
  email: { type: String, required: true },
  items: [{ productId: String, name: String, price: Number, qty: Number }],
  price: { type: Number, required: true },
  status: { type: String, default: "pending" }
}, { timestamps: true });

const OrderModel = model<IOrder>("Order", OrderSchema);
export default OrderModel;
