import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { Brands, Category, SubCategory, User } from './index';
// import { UploadedImage } from 'src/modules/category/category.service';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Object, required: true })
  coverImage: object;

  @Prop({ type: [Object], required: true })
  Images: object[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, min: 1, max: 100 })
  discount: number;

  @Prop({ type: Number, required: true })
  subPrice: number;

  @Prop({ type: Number })
  rateNumber: number;

  @Prop({ type: Number })
  rateAverage: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({
    type: String,
    default: function (this: Product) {
      return slugify(this.name, { lower: true, trim: true, replacement: '-' });
    },
  })
  slug: string;

  @Prop({ type: String })
  customCode: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Brands.name })
  brand: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: SubCategory.name })
  subCategory: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
export type ProductDocument = HydratedDocument<Product>;
