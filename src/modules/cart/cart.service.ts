import { Injectable } from '@nestjs/common';
import { CartRepoServices, ProductRepoServices, UserDocument } from 'src/DB';
import { CartDto, RemoveCartDto } from './Dto/cartDto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepoServices,
    private readonly ProductRepo: ProductRepoServices,
  ) {}

  async addToCart(body: CartDto, user: UserDocument): Promise<object> {
    const { productId, quantity } = body;
    const product = await this.ProductRepo.findById(
      Types.ObjectId.createFromHexString(productId),
    );
    if (!product || product.quantity < quantity)
      return { message: 'product not available' };
    const cartItem = await this.cartRepo.findOne({ userId: user._id });
    if (!cartItem) {
      const cart = await this.cartRepo.create({
        products: [
          {
            productId: product._id,
            quantity: body.quantity,
            finalPrice: product.subPrice,
          },
        ],
        userId: user._id,
      });
      return { message: 'done', cart };
    } else if (
      cartItem &&
      cartItem.products.find(
        (p) => p.productId.toString() === product._id.toString(),
      )
    ) {
      return { message: 'product already in cart' };
    } else if (
      cartItem &&
      !cartItem.products.find(
        (p) => p.productId.toString() === product._id.toString(),
      )
    ) {
      cartItem.products.push({
        productId: product._id,
        quantity: body.quantity,
        finalPrice: product.subPrice,
      });
      await cartItem.save();
      return { message: 'done', cart: cartItem };
    }
    return { message: 'something went wrong' };
  }

  async updateOnCart(body: CartDto, user: UserDocument): Promise<object> {
    const { productId, quantity } = body;
    const product = await this.ProductRepo.findOne({
      _id: Types.ObjectId.createFromHexString(productId),
      quantity: { $gte: quantity },
    });
    if (!product) return { message: 'product not available' };
    const cartItem = await this.cartRepo.findOne({ userId: user._id });
    if (!cartItem) return { message: 'cart not found' };
    const productIndex = cartItem.products.find(
      (p) => p.productId.toString() === product._id.toString(),
    );
    if (!productIndex)
      return { message: 'cart not found or product not in cart' };
    productIndex.quantity = quantity;
    await cartItem.save();
    return { message: 'done' };
  }

  async removeFromCart(
    body: RemoveCartDto,
    user: UserDocument,
  ): Promise<object> {
    const { productId } = body;
    const cartItem = await this.cartRepo.findOne({
      userId: user._id,
      'products.productId': productId,
    });
    if (!cartItem) return { message: 'cart not found or product not in cart' };
    cartItem.products = cartItem.products.filter(
      (product) => product.productId.toString() !== productId,
    );
    await cartItem.save();
    return { message: 'done', cart: cartItem };
  }
}
