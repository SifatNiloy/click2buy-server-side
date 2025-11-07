import { Request, Response } from "express";
import { ProductModel } from "../models/Product.model";
import {
  createProductSchema,
  idParamSchema,
  paginationQuerySchema,
  searchParamSchema,
  updateProductSchema,
  CreateProductInput,
  UpdateProductInput
} from "../schemas/product.schema";

import { v4 as uuid } from "uuid";
import { SendErrorResponse, SendResponse } from "../utils/response";

import { z } from "zod";
import { allowedMimeTypesForProductImage, DATA_NOT_FOUND, INCORRECT_INPUT, SYSTEM_CURRENT_FEATURES } from "../constant/products.constant";
import { ProductService } from "../services";

/**
 * Build the consistent error payload (same pattern as your example)
 */
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

export async function getLimitedProducts(req: Request, res: Response) {
  const functionName = getLimitedProducts.name;
  try {
    const data = await ProductService.findLimitedProducts(10, 8);
    return SendResponse.ok({ res, message: "Limited products", data: { products: data } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Failed to get limited products", DATA_NOT_FOUND, error?.message ?? "Could not fetch limited products")
    });
  }
}

export async function getProducts(req: Request, res: Response) {
  const functionName = getProducts.name;
  try {
    // validate query with zod (reuse paginationQuerySchema)
    const parsed = paginationQuerySchema.safeParse({ query: req.query });
    if (!parsed.success) {
      return SendErrorResponse.error({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid pagination query", INCORRECT_INPUT, parsed.error.message)
      });
    }
    const page = parseInt((req.query.page as string) || "1", 10);
    const size = parseInt((req.query.size as string) || "10", 10);

    const { products, count } = await ProductService.findProducts(page, size);
    return SendResponse.ok({ res, message: "Products fetched", data: { count, products } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Failed to get products", DATA_NOT_FOUND, error?.message ?? "Could not fetch products")
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  const functionName = getProductById.name;
  try {
    const parsed = idParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
      return SendErrorResponse.error({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid id param", INCORRECT_INPUT, parsed.error.message)
      });
    }
    const id = req.params.id;
    const product = await ProductService.findProductById(id);
    if (!product) {
      return SendErrorResponse.notFound({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Product not found", DATA_NOT_FOUND, "No product found with given id")
      });
    }
    return SendResponse.ok({ res, message: "Product fetched", data: { product } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Failed to get product", DATA_NOT_FOUND, error?.message ?? "Could not fetch product")
    });
  }
}

export async function searchProducts(req: Request, res: Response) {
  const functionName = searchProducts.name;
  try {
    const parsed = searchParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
      return SendErrorResponse.error({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid search param", INCORRECT_INPUT, parsed.error.message)
      });
    }
    const name = req.params.name;
    const regex = new RegExp(name, "i");
    const results = await ProductService.searchProductsByName(regex);
    return SendResponse.ok({ res, message: "Search results", data: { products: results } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Product search failed", DATA_NOT_FOUND, error?.message ?? "Could not search products")
    });
  }
}

export async function addProduct(req: Request, res: Response) {
  const functionName = addProduct.name;
  try {
    const parsed = createProductSchema.safeParse({ body: req.body });
    if (!parsed.success) {
      return SendErrorResponse.error({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid product payload", INCORRECT_INPUT, parsed.error.message)
      });
    }

    // Optionally handle file upload that may arrive in req.files (if using multer). Validate mime type if image present.
    const files = (req as any).files as { [field: string]: Express.Multer.File[] } | undefined;
    if (files && files.image && files.image.length) {
      const img = files.image[0];
      if (!allowedMimeTypesForProductImage.includes(img.mimetype)) {
        return SendErrorResponse.error({
          res,
          ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid image type", INCORRECT_INPUT, "Allowed image types: jpg, png, webp, gif")
        });
      }
      // NOTE: actual upload (R2/S3) should happen here. For now assume image URL is uploaded elsewhere and provided in body.images
    }

    const input = parsed.data.body as CreateProductInput;

    const created = await ProductService.createProduct({
      name: input.name,
      price: input.price,
      description: input.description ?? null,
      images: input.images ?? [],
      categories: input.categories ?? [],
      stock: input.stock ?? 0,
      isActive: input.isActive ?? true
    });

    return SendResponse.created({ res, message: "Product created", data: { product: created } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Failed to add product", DATA_NOT_FOUND, error?.message ?? "Could not create product")
    });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const functionName = updateProduct.name;
  try {
    const parsed = updateProductSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
      return SendErrorResponse.error({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid payload", INCORRECT_INPUT, parsed.error.message)
      });
    }
    const { id } = parsed.data.params;
    const product = await ProductService.findProductById(id);
    if (!product) {
      return SendErrorResponse.notFound({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Product not found", DATA_NOT_FOUND, "No product found with given id")
      });
    }

    const payload: Partial<UpdateProductInput> = parsed.data.body;
    const updated = await ProductService.updateProductById(id, payload as any);
    return SendResponse.ok({ res, message: "Product updated", data: { product: updated } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Failed to update product", DATA_NOT_FOUND, error?.message ?? "Could not update product")
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const functionName = deleteProduct.name;
  try {
    const parsed = idParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
      return SendErrorResponse.error({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Invalid id param", INCORRECT_INPUT, parsed.error.message)
      });
    }
    const id = req.params.id;
    const product = await ProductService.findProductById(id);
    if (!product) {
      return SendErrorResponse.notFound({
        res,
        ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Product not found", DATA_NOT_FOUND, "No product found with given id")
      });
    }

    await ProductService.deleteProductById(id);
    return SendResponse.ok({ res, message: "Product deleted", data: { success: true } });
  } catch (error: any) {
    return SendErrorResponse.serverError({
      res,
      ...buildErrorPayload(req.originalUrl, functionName, req.method.toUpperCase(), "Failed to delete product", DATA_NOT_FOUND, error?.message ?? "Could not delete product")
    });
  }
}
