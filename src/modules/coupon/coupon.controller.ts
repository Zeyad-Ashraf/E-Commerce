import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponDto } from './Dto/couponDto';
import { UserDocument } from 'src/DB';
import { CurrentUser } from 'src/common/decorators/requestDecorator';
import { Auth } from 'src/common/decorators/authDecorator';
import { EnumRole } from 'src/common';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponServices: CouponService) {}

  @Post()
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createCoupon(
    @Body() body: CouponDto,
    @CurrentUser() user: UserDocument,
  ): Promise<object> {
    return await this.couponServices.createOne(body, user);
  }
}
