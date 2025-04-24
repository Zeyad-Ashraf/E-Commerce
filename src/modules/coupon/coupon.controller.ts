import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponDto, UpdateCouponDto } from './Dto/couponDto';
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

  @Get('/:id')
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getSpecificCoupon(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<object> {
    return await this.couponServices.getCoupon(id, user);
  }

  @Get('')
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getCoupons(@CurrentUser() user: UserDocument): Promise<object> {
    return await this.couponServices.getCoupons(user);
  }

  @Patch(':id')
  @Auth(EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateCoupon(
    @Param('id') id: string,
    @Body() body: UpdateCouponDto,
    @CurrentUser() user: UserDocument,
  ): Promise<object> {
    return await this.couponServices.updateOne(id, body, user);
  }

  @Delete('/:id')
  @Auth(EnumRole.admin)
  async deleteOneCoupon(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<object> {
    return await this.couponServices.deleteCoupon(id, user);
  }
}
