import { Module } from '@nestjs/common';
import { AuthModule } from '../users/user.module';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subCategory/subCategory.module';
import { BrnadModule } from '../brands/brand.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel, ProductRepoServices } from 'src/DB';

@Module({
  imports: [
    BrnadModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    ProductModel,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepoServices],
  exports: [ProductService, ProductRepoServices, ProductModel],
})
export class ProductModule {}
