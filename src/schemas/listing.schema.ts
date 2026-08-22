import { object, string, number, TypeOf } from "zod";

export const createListingSchema = object({
  body: object({
    name: string().trim().min(2).max(100),
    description: string().trim().min(10).max(2000),
    price: number().nonnegative(),
    image: string().trim().url(),
    category: string().trim().min(1).max(60),
    condition: string().trim().min(1).max(40)
  })
});

export type CreateListingInput = TypeOf<typeof createListingSchema>["body"];