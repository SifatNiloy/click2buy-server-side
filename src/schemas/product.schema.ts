import { object, string, number, TypeOf, array, optional, boolean } from "zod";

export const paginationQuerySchema = object({
  query: object({
    page: string()
      .optional()
      .refine((val) => val === undefined || /^[0-9]+$/.test(val), {
        message: "Page must be a positive integer"
      })
      .default("1"),
    size: string()
      .optional()
      .refine((val) => val === undefined || /^[0-9]+$/.test(val), {
        message: "Size must be a positive integer"
      })
      .default("10")
  })
});

export const createProductSchema = object({
  body: object({
    name: string().min(1, "Name is required"),
    price: number().nonnegative("Price must be >= 0"),
    description: string().optional(),
    images: array(string()).optional(),
    categories: array(string()).optional(),
    stock: number().int().nonnegative().optional(),
    isActive: boolean().optional()
  })
});

export const updateProductSchema = object({
  params: object({
    id: string().min(1, "Product ID is required")
  }),
  body: object({
    name: string().optional(),
    price: number().nonnegative().optional(),
    description: string().optional(),
    images: array(string()).optional(),
    categories: array(string()).optional(),
    stock: number().int().nonnegative().optional(),
    isActive: string().optional()
  })
});

export const idParamSchema = object({
  params: object({
    id: string().min(1, "ID is required")
  })
});

export const searchParamSchema = object({
  params: object({
    name: string().min(1, "Search term required")
  })
});

export type CreateProductInput = TypeOf<typeof createProductSchema>["body"];
export type UpdateProductInput = TypeOf<typeof updateProductSchema>["body"];
export type PaginationQuery = {
  page: number;
  size: number;
};
