import { ModelOptions, Prop, getModelForClass } from "@typegoose/typegoose";

@ModelOptions({ schemaOptions: { collection: "products", timestamps: true } })
export class Product {
  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: false, type: String, default: null })
  slug?: string | null; 

  @Prop({ required: true, type: Number })
  price!: number;

  @Prop({ required: false, type: Number, default: null })
  discountPrice?: number | null; 

  @Prop({ required: false, type: String, default: null })
  description?: string | null;

  @Prop({ type: () => [String], default: [] })
  images?: string[]; 

  @Prop({ type: () => [String], default: [] })
  categories?: string[];

  @Prop({ required: true, default: 0, type: Number })
  stock!: number;

  @Prop({ required: false, type: String, default: null })
  brand?: string | null; 

  @Prop({ required: false, type: Number, default: 0 })
  rating?: number; 

  @Prop({ required: false, type: Number, default: 0 })
  numberOfReviews?: number; 

  @Prop({ required: true, default: true, type: Boolean })
  isActive!: boolean;

}

export const ProductModel = getModelForClass(Product);

export default ProductModel;