import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OpenrouterService } from './openRouter.service';
import { OpenDto } from './Dto/openRouterDto';

@Controller('ChatBot')
export class OpenrouterController {
  constructor(private readonly openRouterService: OpenrouterService) {}

  @Post('bestItem')
  @HttpCode(200)
//   @Auth(EnumRole.user, EnumRole.admin)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getBestProducts(@Body() data: OpenDto): Promise<object> {
    return await this.openRouterService.FindBestBrandForItem(data);
  }
}
