import { Module } from '@nestjs/common';
import {
  OrdersModel,
  OrdersRepoServices,
  ProductModel,
  ProductRepoServices,
} from 'src/DB';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthModule } from '../users/user.module';
import { CartModule } from '../cart/cart.module';
import { PaymentService } from './paymentService';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [OrdersModel, AuthModule, CartModule, CouponModule, ProductModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrdersRepoServices,
    PaymentService,
    ProductRepoServices,
  ],
})
export class OrderModule {}
