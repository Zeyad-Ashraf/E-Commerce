import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category, SubCategory, User } from './index';
import slugify from 'slugify';
import { UploadedImage } from 'src/modules/category/category.service';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brands {
  @Prop({
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3,
    trim: true,
  })
  name: string;

  @Prop({ type: Object, required: true })
  logo: UploadedImage;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    default: function (this: Brands) {
      return slugify(this.name, {
        lower: true,
        trim: true,
        replacement: '-',
      });
    },
  })
  slug: string;

  @Prop({ type: [Types.ObjectId], required: true, ref: Category.name })
  category: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], required: true, ref: SubCategory.name })
  subCategory: Types.ObjectId[];

  @Prop({ type: String, required: true })
  customCode: string;
}

export const BrandsSchema = SchemaFactory.createForClass(Brands);
export const BrandsModel = MongooseModule.forFeature([
  { name: Brands.name, schema: BrandsSchema },
]);
export type BrandsDocument = HydratedDocument<Brands>;
