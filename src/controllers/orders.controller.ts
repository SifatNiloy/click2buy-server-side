import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { SendErrorResponse, SendResponse } from "../utils/response";
import * as OrderService from "../services/order.service";
import {
  createOrderSchema,
  idParamSchema,
  updateOrderStatusSchema,
  queryEmailSchema
} from "../schemas/order.schema";
import { DATA_NOT_FOUND, INCORRECT_INPUT, SYSTEM_CURRENT_FEATURES } from "../constant/products.constant";


function buildErrorPayload(
  endpoint: string,
  functionName: string,
  method: string,
  message: string,
  error: { code: string; message: string },
  customMsg: string
) {
  return {
    message,
    data: {
      clientError: { ...error, message: customMsg },
      endpoint,
      functionName,
      method,
      service: SYSTEM_CURRENT_FEATURES.ECOMMERCE,
      id: uuid()
    }
  };
}

export async function postOrder(req: Request, res: Response) {
  const functionName = postOrder.name;
  const parsed = createOrderSchema.safeParse({ body: req.body });
  if (!parsed.success) {
    return SendErrorResponse.error({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Invalid order data", INCORRECT_INPUT, parsed.error.message)
    });
  }
  try {
    const created = await OrderService.createOrder(parsed.data.body);
    return SendResponse.created({ res, message: "Order placed", data: { order: created } });
  } catch (err: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Order creation failed", DATA_NOT_FOUND, err?.message ?? "Error creating order")
    });
  }
}

export async function getOrders(req: Request, res: Response) {
  const functionName = getOrders.name;
  const parsed = queryEmailSchema.safeParse({ query: req.query });
  if (!parsed.success) {
    return SendErrorResponse.error({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Invalid query", INCORRECT_INPUT, parsed.error.message)
    });
  }
  const email = parsed.data.query.email;
  try {
    const data = email ? await OrderService.findOrdersByEmail(email) : await OrderService.findAllOrders();
    return SendResponse.ok({ res, message: "Orders fetched", data: { orders: data } });
  } catch (err: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Fetch orders failed", DATA_NOT_FOUND, err?.message ?? "Could not fetch orders")
    });
  }
}

export async function getOrderById(req: Request, res: Response) {
  const functionName = getOrderById.name;
  const parsed = idParamSchema.safeParse({ params: req.params });
  if (!parsed.success) {
    return SendErrorResponse.error({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Invalid id", INCORRECT_INPUT, parsed.error.message)
    });
  }
  try {
    const order = await OrderService.findOrderById(req.params.id);
    if (!order) {
      return SendErrorResponse.notFound({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method, "Order not found", DATA_NOT_FOUND, "No order found with given id")
      });
    }
    return SendResponse.ok({ res, message: "Order fetched", data: { order } });
  } catch (err: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Fetch order failed", DATA_NOT_FOUND, err?.message ?? "Could not get order")
    });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  const functionName = deleteOrder.name;
  const parsed = idParamSchema.safeParse({ params: req.params });
  if (!parsed.success) {
    return SendErrorResponse.error({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Invalid id", INCORRECT_INPUT, parsed.error.message)
    });
  }
  try {
    const order = await OrderService.findOrderById(req.params.id);
    if (!order) {
      return SendErrorResponse.notFound({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method, "Order not found", DATA_NOT_FOUND, "Cannot delete nonexistent order")
      });
    }
    await OrderService.deleteOrderById(req.params.id);
    return SendResponse.ok({ res, message: "Order deleted", data: { success: true } });
  } catch (err: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Delete failed", DATA_NOT_FOUND, err?.message ?? "Could not delete order")
    });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  const functionName = updateOrderStatus.name;
  const parsed = updateOrderStatusSchema.safeParse({ params: req.params, body: req.body });
  if (!parsed.success) {
    return SendErrorResponse.error({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Invalid payload", INCORRECT_INPUT, parsed.error.message)
    });
  }
  try {
    const order = await OrderService.updateOrderStatus(req.params.id, parsed.data.body.orderStatus);
    if (!order) {
      return SendErrorResponse.notFound({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method, "Order not found", DATA_NOT_FOUND, "No order found with given id")
      });
    }
    return SendResponse.ok({ res, message: "Order status updated", data: { order } });
  } catch (err: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Status update failed", DATA_NOT_FOUND, err?.message ?? "Could not update order status")
    });
  }
}

export async function getOrderStats(req: Request, res: Response) {
  const functionName = getOrderStats.name;
  try {
    const stats = await OrderService.getOrderStats();
    return SendResponse.ok({ res, message: "Order stats", data: stats });
  } catch (err: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method, "Stats fetch failed", DATA_NOT_FOUND, err?.message ?? "Could not fetch stats")
    });
  }
}
