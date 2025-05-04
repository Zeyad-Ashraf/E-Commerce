import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/common/decorators/authDecorator';
import { CreateOrderDto } from './Dto/orderDto';
import { CurrentUser } from 'src/common/decorators/requestDecorator';
import { UserDocument } from 'src/DB';
import { EnumRole } from 'src/common';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderServices: OrderService) {}

  @Post('create')
  @Auth(EnumRole.user, EnumRole.admin)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createOrder(
    @Body() body: CreateOrderDto,
    @CurrentUser() user: UserDocument,
  ): Promise<object> {
    return await this.orderServices.createOrder(body, user);
  }

  @Post('payment/stripe')
  @Auth(EnumRole.user, EnumRole.admin)
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async paymentWithStripe(
    @Body('orderId') orderId: string,
    @CurrentUser() user: UserDocument,
    @Body('couponId') couponId?: string,
  ): Promise<object> {
    return await this.orderServices.paymentWithStripe(orderId, user, couponId);
  }

  @Post('webhook')
  @HttpCode(201)
  async forWebHook(@Body() data: any): Promise<object> {
    return await this.orderServices.webHookService(data);
  }
}
