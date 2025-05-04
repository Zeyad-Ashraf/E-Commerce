import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponsModel, CouponsRepoServices } from 'src/DB';
import { AuthModule } from '../users/user.module';
import { PaymentService } from '../orders/paymentService';

@Module({
  imports: [CouponsModel, AuthModule],
  controllers: [CouponController],
  providers: [CouponService, CouponsRepoServices, PaymentService],
  exports: [CouponService, CouponsRepoServices],
})
export class CouponModule {}
