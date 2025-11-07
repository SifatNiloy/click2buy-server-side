export const allowedMimeTypesForProductImage = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

export enum PRODUCT_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export const SYSTEM_CURRENT_FEATURES = {
  ECOMMERCE: "ECOMMERCE"
};

// common error codes similar to your example
export const INPUT_MISSING = { code: "INPUT_MISSING", message: "Required input missing" };
export const INCORRECT_INPUT = { code: "INCORRECT_INPUT", message: "Incorrect input" };
export const DATA_NOT_FOUND = { code: "DATA_NOT_FOUND", message: "Data not found" };
