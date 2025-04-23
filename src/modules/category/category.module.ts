import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryModel, CategoryRepoServices } from 'src/DB';
import { AuthGuard } from 'src/common/guards/authentication';
import { RolesGuard } from 'src/common/guards/authorization';
import { CloudinaryService } from 'src/common';
import { AuthModule } from '../users/user.module';

@Module({
  imports: [CategoryModel, AuthModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepoServices,
    AuthGuard,
    RolesGuard,
    CloudinaryService,
  ],
  exports: [
    CategoryService,
    CategoryRepoServices,
    AuthGuard,
    RolesGuard,
    CategoryModel,
    CloudinaryService,
  ],
})
export class CategoryModule {}
