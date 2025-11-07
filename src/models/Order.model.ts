import { prop, getModelForClass } from "@typegoose/typegoose";

export class OrderItem {
  @prop({ required: true })
  productId!: string;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  price!: number;

  @prop({ required: true })
  qty!: number;
}

export class ShippingInfo {
  @prop({ required: true })
  address!: string;

  @prop({ required: true })
  city!: string;

  @prop({ required: true })
  country!: string;

  @prop({ required: true })
  postalCode!: string;
}

export class Order {
  @prop({ required: true })
  email!: string;

  @prop({ type: () => [OrderItem], required: true })
  items!: OrderItem[];

  @prop({ required: true })
  totalPrice!: number;

  @prop({ type: () => ShippingInfo })
  shipping!: ShippingInfo;

  @prop({ required: false, default: "unpaid" })
  paymentStatus!: string;

  @prop({ required: false, default: "pending" })
  orderStatus!: string;

  @prop({ default: Date.now })
  createdAt?: Date;

  @prop({ default: Date.now })
  updatedAt?: Date;
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true, collection: "orders" }
});

export default OrderModel;
