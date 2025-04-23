import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product, User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cart {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], required: true, ref: Product.name })
  productId: [Types.ObjectId];

  @Prop({ type: Number, required: true })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
export type CartDocument = HydratedDocument<Cart>;
