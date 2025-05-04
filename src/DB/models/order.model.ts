import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Coupons, User, Cart } from './index';
import { EnumPaymentMethods, EnumStatus } from 'src/common';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Orders {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: Cart.name })
  Cart: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({
    type: String,
    enum: Object.values(EnumPaymentMethods),
    required: true,
  })
  paymentMethod: EnumPaymentMethods;

  @Prop({
    type: String,
    enum: Object.values(EnumStatus),
    required: true,
  })
  status: EnumStatus;

  @Prop({ type: Types.ObjectId, ref: Coupons.name })
  coupon: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  canceledBy: Types.ObjectId;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: String })
  payment_intent: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
export const OrdersModel = MongooseModule.forFeature([
  { name: Orders.name, schema: OrdersSchema },
]);

export type OrdersDocument = HydratedDocument<Orders>;
