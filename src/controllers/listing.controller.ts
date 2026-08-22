import { Request, Response } from "express";
import { createListingSchema } from "../schemas/listing.schema";
import { createListing, findListingsBySeller } from "../services/listing.service";

export async function submitListing(req: Request, res: Response) {
  const parsed = createListingSchema.safeParse({ body: req.body });
  if (!parsed.success) {
    return res.status(400).json({ message: "Please check the listing details", errors: parsed.error.flatten() });
  }

  const user = (req as any).user;
  if (!user?._id || !user.email) {
    return res.status(401).json({ message: "Please sign in before submitting a listing" });
  }

  const listing = await createListing({
    ...parsed.data.body,
    sellerId: user._id.toString(),
    sellerEmail: user.email,
    sellerName: user.name || null
  });

  return res.status(201).json({ message: "Listing submitted for review", data: { listing } });
}

export async function getMyListings(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user?._id) return res.status(401).json({ message: "Unauthorized access" });

  const listings = await findListingsBySeller(user._id.toString());
  return res.status(200).json({ message: "Your listings", data: { listings } });
}