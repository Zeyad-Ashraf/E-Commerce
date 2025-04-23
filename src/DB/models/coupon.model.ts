import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Coupons {
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  addedBy: Types.ObjectId;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  expireAt: Date;

  @Prop({ type: [Types.ObjectId], ref: User.name })
  users: [Types.ObjectId];
}

export const CouponsSchema = SchemaFactory.createForClass(Coupons);
export const CouponsModel = MongooseModule.forFeature([
  { name: Coupons.name, schema: CouponsSchema },
]);
export type CouponsDocument = HydratedDocument<Coupons>;
