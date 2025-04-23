import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Coupons, Product, User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Orders {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
  products: [Types.ObjectId];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  payment: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Coupons.name })
  couponId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  canceledBy: Types.ObjectId;

  @Prop({ type: String, required: true })
  reason: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
export const OrdersModel = MongooseModule.forFeature([
  { name: Orders.name, schema: OrdersSchema },
]);
export type OrdersDocument = HydratedDocument<Orders>;
