export enum ORDER_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export enum PAYMENT_STATUS {
  UNPAID = "unpaid",
  PAID = "paid",
  REFUNDED = "refunded"
}

export const SYSTEM_CURRENT_FEATURES = {
  ECOMMERCE: "ECOMMERCE"
};

export const INPUT_MISSING = { code: "INPUT_MISSING", message: "Missing required input" };
export const INCORRECT_INPUT = { code: "INCORRECT_INPUT", message: "Invalid input" };
export const DATA_NOT_FOUND = { code: "DATA_NOT_FOUND", message: "Data not found" };
export const OPERATION_FAILED = { code: "OPERATION_FAILED", message: "Operation failed" };
