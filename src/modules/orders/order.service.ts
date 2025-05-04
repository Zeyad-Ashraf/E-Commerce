import { Injectable } from '@nestjs/common';
import {
  CartRepoServices,
  CouponsRepoServices,
  OrdersRepoServices,
  Product,
  UserDocument,
} from 'src/DB';
import { CreateOrderDto } from './Dto/orderDto';
import { Types } from 'mongoose';
import { EnumPaymentMethods, EnumStatus } from 'src/common';
import { PaymentService } from './paymentService';
import Stripe from 'stripe';

interface CartProduct {
  productId: {
    name: string;
    coverImage: { secure_url: string };
    price: number;
  };
  quantity: number;
}

@Injectable()
export class OrderService {
  constructor(
    private readonly ordersRepo: OrdersRepoServices,
    private readonly cartRepo: CartRepoServices,
    private readonly paymentService: PaymentService,
    private readonly couponRepo: CouponsRepoServices,
  ) {}

  async createOrder(body: CreateOrderDto, user: UserDocument): Promise<object> {
    const { cart, phone, address, paymentMethod } = body;
    const findCart = await this.cartRepo.findById(
      Types.ObjectId.createFromHexString(cart),
      [{ path: 'products.productId' }],
    );
    if (!findCart) return { message: 'cart not found' };
    const productNotFound = findCart.products.some((product) => {
      const productDetails = product.productId as unknown as Product;
      return productDetails.quantity < product.quantity;
    });
    if (productNotFound)
      return { message: 'not enough stock for this products' };

    const order = await this.ordersRepo.create({
      user: user._id,
      Cart: findCart._id,
      totalPrice: findCart.totalPrice,
      phone,
      address,
      paymentMethod,
      status:
        paymentMethod === EnumPaymentMethods.cash
          ? EnumStatus.placed
          : EnumStatus.pinding,
    });
    return { message: 'done', order };
  }

  async paymentWithStripe(
    orderId: string,
    user: UserDocument,
    couponId?: string,
  ): Promise<object> {
    const order = await this.ordersRepo.findOne(
      {
        _id: Types.ObjectId.createFromHexString(orderId),
        user: user._id,
        status: EnumStatus.pinding,
        paymentMethod: EnumPaymentMethods.card,
      },
      [
        {
          path: 'Cart',
          populate: [
            {
              path: 'products.productId',
            },
          ],
        },
      ],
    );
    if (!order) return { message: 'order not found' };

    let discount: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (couponId) {
      const findCoupon = await this.couponRepo.findOne({ stripeId: couponId });
      if (!findCoupon) return { message: 'coupon not found' };
      discount = [
        {
          coupon: findCoupon.stripeId.toString(),
        },
      ];
    }

    const session = await this.paymentService.createCheckoutSession({
      customer_email: user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      line_items: (order.Cart['products'] as CartProduct[]).map(
        (product: CartProduct) => ({
          price_data: {
            currency: 'egp',
            product_data: {
              name: product.productId.name,
              images: [product.productId.coverImage.secure_url],
            },
            unit_amount: product.productId.price * 100,
          },
          quantity: product.quantity,
        }),
      ) as Stripe.Checkout.SessionCreateParams.LineItem[],
      discounts: discount ? discount : [],
    });

    return { message: 'done', sessionUrl: session.url };
  }

  async webHookService(data: {
    data: { object: { metadata: { orderId: string }; payment_intent: string } };
  }): Promise<object> {
    const order = await this.ordersRepo.findOneAndUpdate(
      {
        _id: data.data.object.metadata.orderId,
      },
      {
        payment_intent: data.data.object.payment_intent,
        status: EnumStatus.paid,
      },
    );
    return { message: 'done', order };
  }
}
