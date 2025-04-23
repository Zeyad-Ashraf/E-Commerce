import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, Category } from './index';
import slugify from 'slugify';
import { UploadedImage } from 'src/modules/category/category.service';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3,
    trim: true,
  })
  name: string;

  @Prop({ type: Object, required: true })
  image: UploadedImage;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    default: function (this: SubCategory) {
      return slugify(this.name, {
        lower: true,
        trim: true,
        replacement: '-',
      });
    },
  })
  slug: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Category.name })
  categoryId: Types.ObjectId;

  @Prop({ type: String })
  customCode: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
export const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);
export type SubCategoryDocument = HydratedDocument<SubCategory>;
