import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor() {}
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  async createCheckoutSession({
    customer_email,
    metadata,
    line_items,
    discounts,
  }) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customer_email as string,
      metadata: metadata as Stripe.MetadataParam,
      line_items: line_items as Stripe.Checkout.SessionCreateParams.LineItem[],
      discounts: discounts as Stripe.Checkout.SessionCreateParams.Discount[],
      success_url: 'https://localhost:3000/orders/success',
      cancel_url: 'https://localhost:3000/orders/cancel',
    });
  }

  async createCoupon({ percent_off }: { percent_off: number }) {
    return await this.stripe.coupons.create({
      percent_off,
      duration: 'once',
    });
  }

  async refund({
    payment_intent,
    reason,
  }: {
    payment_intent: string;
    reason?: string;
  }) {
    return await this.stripe.refunds.create({
      payment_intent: payment_intent,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });
  }
}
