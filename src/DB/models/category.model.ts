import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './index';
import { UploadedImage } from 'src/modules/category/category.service';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
  @Prop({
    type: String,
    required: true,
    maxlength: 15,
    minlength: 3,
    trim: true,
  })
  name: string;

  @Prop({ type: Object })
  image: UploadedImage;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  addedBy: Types.ObjectId;

  @Prop({
    type: String,
    default: function (this: Category): string {
      return slugify(this.name, {
        // ana hinna slugify el name
        lower: true,
        trim: true,
        replacement: '-',
      });
    },
  })
  slug: string;

  @Prop({ type: String })
  customCode: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
export type CategoryDocument = HydratedDocument<Category>;
