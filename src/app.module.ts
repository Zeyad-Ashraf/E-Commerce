import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/users/user.module';
import { CategoryModule } from './modules/category/category.module';
import { SubCategoryModule } from './modules/subCategory/subCategory.module';
import { BrnadModule } from './modules/brands/brand.module';
import { ProductModule } from './modules/products/product.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/orders/order.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { OpenRouterModule } from './modules/openRouter/openRouter.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URI,
        }),
        ttl: 120,
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrnadModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule,
    OpenRouterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
