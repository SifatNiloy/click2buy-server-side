import { Schema, model } from "mongoose";

export interface IReview {
  userEmail: string;
  productId: string;
  text: string;
  rating?: number;
}

const ReviewSchema = new Schema<IReview>({
  userEmail: { type: String, required: true },
  productId: { type: String, required: true },
  text: { type: String, required: true },
  rating: Number
}, { timestamps: true });

const ReviewModel = model<IReview>("Review", ReviewSchema);
export default ReviewModel;
