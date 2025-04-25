import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel, CartRepoServices } from 'src/DB';
import { AuthModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [CartModel, AuthModule, ProductModule],
  controllers: [CartController],
  providers: [CartService, CartRepoServices],
  exports: [CartModel, CartRepoServices],
})
export class CartModule {}
