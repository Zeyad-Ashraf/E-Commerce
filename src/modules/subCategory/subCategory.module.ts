import { Module } from '@nestjs/common';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryService } from './subCategory.service';
import { SubCategoryModel, SubCategoryRepoServices } from 'src/DB';
import { AuthModule } from '../users/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [SubCategoryModel, AuthModule, CategoryModule],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, SubCategoryRepoServices],
  exports: [SubCategoryService, SubCategoryRepoServices, SubCategoryModel],
})
export class SubCategoryModule {}
