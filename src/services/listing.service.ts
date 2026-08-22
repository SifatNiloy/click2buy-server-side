import ListingModel from "../models/Listing.model";
import { CreateListingInput } from "../schemas/listing.schema";

export async function createListing(data: CreateListingInput & {
  sellerId: string;
  sellerEmail: string;
  sellerName?: string | null;
}) {
  return ListingModel.create({ ...data, status: "pending" });
}

export async function findListingsBySeller(sellerId: string) {
  return ListingModel.find({ sellerId }).sort({ createdAt: -1 });
}