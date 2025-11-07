import { OrderModel } from "../models/Order.model";
import { Order } from "../models/Order.model";

export async function createOrder(data: Partial<Order>) {
  return OrderModel.create(data);
}

export async function findAllOrders() {
  return OrderModel.find().sort({ createdAt: -1 });
}

export async function findOrdersByEmail(email: string) {
  return OrderModel.find({ email }).sort({ createdAt: -1 });
}

export async function findOrderById(id: string) {
  return OrderModel.findById(id);
}

export async function deleteOrderById(id: string) {
  return OrderModel.deleteOne({ _id: id });
}

export async function updateOrderStatus(id: string, status: string) {
  return OrderModel.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
}

export async function getOrderStats() {
  const totalOrders = await OrderModel.countDocuments();
  const totalRevenueAgg = await OrderModel.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  return { totalOrders, totalRevenue };
}
