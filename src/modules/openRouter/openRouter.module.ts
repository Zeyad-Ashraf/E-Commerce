import { Module } from '@nestjs/common';
import { OpenrouterController } from './openRouter.controller';
import { OpenrouterService } from './openRouter.service';
import {
  OrdersModel,
  OrdersRepoServices,
  ProductModel,
  ProductRepoServices,
} from 'src/DB';
import { AuthModule } from '../users/user.module';

@Module({
  imports: [ProductModel, OrdersModel, AuthModule],
  controllers: [OpenrouterController],
  providers: [OpenrouterService, ProductRepoServices, OrdersRepoServices],
})
export class OpenRouterModule {}
