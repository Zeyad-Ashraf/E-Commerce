import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandsModel, BrandsRepoServices } from 'src/DB';
import { AuthGuard } from 'src/common/guards/authentication';
import { RolesGuard } from 'src/common/guards/authorization';
import { CloudinaryService } from 'src/common';
import { AuthModule } from '../users/user.module';

@Module({
  imports: [BrandsModel, AuthModule],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandsRepoServices,
    AuthGuard,
    RolesGuard,
    CloudinaryService,
  ],
  exports: [
    BrandService,
    BrandsRepoServices,
    AuthGuard,
    RolesGuard,
    BrandsModel,
  ],
})
export class BrnadModule {}
