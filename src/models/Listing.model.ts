import { ModelOptions, Prop, getModelForClass } from "@typegoose/typegoose";

@ModelOptions({ schemaOptions: { collection: "listings", timestamps: true } })
export class Listing {
  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, trim: true, type: String })
  description!: string;

  @Prop({ required: true, min: 0, type: Number })
  price!: number;

  @Prop({ required: true, trim: true, type: String })
  image!: string;

  @Prop({ required: true, trim: true, type: String })
  category!: string;

  @Prop({ required: true, trim: true, type: String })
  condition!: string;

  @Prop({ required: true, type: String })
  sellerId!: string;

  @Prop({ required: true, type: String })
  sellerEmail!: string;

  @Prop({ required: false, type: String, default: null })
  sellerName?: string | null;

  @Prop({ required: true, enum: ["pending", "approved", "rejected"], default: "pending" })
  status!: "pending" | "approved" | "rejected";
}

export const ListingModel = getModelForClass(Listing);
export default ListingModel;