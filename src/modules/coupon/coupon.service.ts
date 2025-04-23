import { Injectable } from '@nestjs/common';
import { CouponsDocument, CouponsRepoServices, UserDocument } from 'src/DB';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepo: CouponsRepoServices) {}

  async createOne(
    body: Partial<CouponsDocument>,
    user: UserDocument,
  ): Promise<object> {
    const { code, amount, fromDate, expireAt } = body;
    const findCoupon = await this.couponRepo.findOne({ code });
    if (findCoupon) return { message: 'Coupon already exists' };

    const newCoupon = await this.couponRepo.create({
      code,
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
}
