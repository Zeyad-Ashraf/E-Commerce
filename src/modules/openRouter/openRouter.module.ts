import { Module } from '@nestjs/common';
import { OpenrouterController } from './openRouter.controller';
import { OpenrouterService } from './openRouter.service';
import { ProductModel, ProductRepoServices } from 'src/DB';

@Module({
  imports: [ProductModel],
  controllers: [OpenrouterController],
  providers: [OpenrouterService, ProductRepoServices],
})
export class OpenRouterModule {}
