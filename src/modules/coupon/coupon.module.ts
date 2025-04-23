import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponsModel, CouponsRepoServices } from 'src/DB';
import { AuthModule } from '../users/user.module';

@Module({
  imports: [CouponsModel, AuthModule],
  controllers: [CouponController],
  providers: [CouponService, CouponsRepoServices],
  exports: [CouponService, CouponsRepoServices],
})
export class CouponModule {}
