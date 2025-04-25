import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product, User } from './index';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cart {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name, unique: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: Product.name },
        quantity: Number,
        finalPrice: Number,
      },
    ],
    required: true,
  })
  products: {
    productId: Types.ObjectId;
    quantity: number;
    finalPrice: number;
  }[];

  @Prop({ type: Number })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('save', function (next) {
  this.totalPrice = this.products.reduce((acc, product) => {
    return acc + product.finalPrice * product.quantity;
  }, 0);
  next();
});

export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
export type CartDocument = HydratedDocument<Cart>;
