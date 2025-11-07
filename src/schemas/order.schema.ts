import { object, string, number, array, TypeOf } from "zod";

const orderItemSchema = object({
  productId: string().min(1),
  name: string(),
  price: number().nonnegative(),
  qty: number().int().positive()
});

const shippingSchema = object({
  address: string().min(1),
  city: string().min(1),
  country: string().min(1),
  postalCode: string().min(1)
});

export const createOrderSchema = object({
  body: object({
    email: string().email(),
    items: array(orderItemSchema).nonempty(),
    totalPrice: number().nonnegative(),
    shipping: shippingSchema,
    paymentStatus: string().optional(),
    orderStatus: string().optional()
  })
});

export const updateOrderStatusSchema = object({
  params: object({
    id: string().min(1)
  }),
  body: object({
    orderStatus: string().min(1)
  })
});

export const idParamSchema = object({
  params: object({
    id: string().min(1, "Order ID required")
  })
});

export const queryEmailSchema = object({
  query: object({
    email: string().email().optional()
  })
});

export type CreateOrderInput = TypeOf<typeof createOrderSchema>["body"];
export type UpdateOrderStatusInput = TypeOf<typeof updateOrderStatusSchema>["body"];
