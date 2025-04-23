import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Orders, Product, User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Review {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  rate: number;

  @Prop({ type: String, required: true })
  comment: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Orders.name })
  orderId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export const ReviewModel = MongooseModule.forFeature([
  { name: Review.name, schema: ReviewSchema },
]);
export type ReviewDocument = HydratedDocument<Review>;
