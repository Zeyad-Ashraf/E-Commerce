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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrnadModule,
    ProductModule,
    CouponModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
