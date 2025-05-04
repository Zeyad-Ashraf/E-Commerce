import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CouponsDocument, CouponsRepoServices, UserDocument } from 'src/DB';
import { UpdateCouponDto } from './Dto/couponDto';
import { PaymentService } from '../orders/paymentService';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepo: CouponsRepoServices,
    private readonly paymentService: PaymentService,
  ) {}

  async createOne(
    body: Partial<CouponsDocument>,
    user: UserDocument,
  ): Promise<object> {
    const { amount, fromDate, expireAt } = body;

    const createStripeCoupon = await this.paymentService.createCoupon({
      percent_off: amount as number,
    });

    if (!createStripeCoupon) throw new BadRequestException('Coupon not found');

    if (!user) throw new BadRequestException('Not logged in');

    const findCoupon = await this.couponRepo.findOne({
      stripeId: createStripeCoupon.id,
    });
    if (findCoupon) return { message: 'Coupon already exists' };

    const newCoupon = await this.couponRepo.create({
      stripeId: createStripeCoupon.id,
      amount,
      fromDate,
      expireAt,
      addedBy: user._id,
    });

    return {
      message: 'Coupon created successfully',
      coupon: newCoupon,
    };
  }

  async getCoupon(id: string, user: UserDocument): Promise<object> {
    const findCoupons = await this.couponRepo.findOne({
      _id: new Types.ObjectId(id),
      addedBy: user._id,
    });
    if (!findCoupons) return { message: 'Coupon not found' };
    return { message: 'done', coupons: findCoupons };
  }

  async getCoupons(user: UserDocument): Promise<object> {
    const findCoupons = await this.couponRepo.findAll({ addedBy: user._id });
    if (findCoupons.length === 0) return { message: 'Coupon not found' };
    return { message: 'done', coupon: findCoupons };
  }

  async updateOne(
    couponId: string,
    body: UpdateCouponDto,
    user: UserDocument,
  ): Promise<object> {
    const newCoupon = await this.couponRepo.findOneAndUpdate(
      { _id: new Types.ObjectId(couponId), addedBy: user._id },
      {
        ...body,
      },
    );
    if (!newCoupon) return { message: 'Coupon not found' };

    return { message: 'done' };
  }
  async deleteCoupon(id: string, user: UserDocument): Promise<object> {
    const findCoupons = await this.couponRepo.findOneAndDelete({
      addedBy: user._id,
      _id: new Types.ObjectId(id),
    });
    if (!findCoupons) return { message: 'Coupon not found' };
    return { message: 'done' };
  }
}
