import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EnumRole } from 'src/common';
import { Auth } from 'src/common/decorators/authDecorator';
import { CartService } from './cart.service';
import { CartDto, RemoveCartDto } from './Dto/cartDto';
import { CurrentUser } from 'src/common/decorators/requestDecorator';
import { UserDocument } from 'src/DB';

@Controller('cart')
export class CartController {
  constructor(private readonly cartServices: CartService) {}

  @Post()
  @HttpCode(201)
  @Auth(EnumRole.user)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async addToCart(@Body() body: CartDto, @CurrentUser() user: UserDocument) {
    return await this.cartServices.addToCart(body, user);
  }

  @Patch()
  @HttpCode(201)
  @Auth(EnumRole.user)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateOnCart(@Body() body: CartDto, @CurrentUser() user: UserDocument) {
    return await this.cartServices.updateOnCart(body, user);
  }

  @Delete()
  @HttpCode(201)
  @Auth(EnumRole.user)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async removeFromCart(
    @Body() body: RemoveCartDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.cartServices.removeFromCart(body, user);
  }
}
