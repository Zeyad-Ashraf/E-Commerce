import {
  Controller,
  Body,
  Post,
  HttpCode,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
  Get,
  SetMetadata,
} from '@nestjs/common';
import { confrimDto, LoginDto, UserDto } from './dto/userDto';
import { AuthService } from './user.service';
import { AuthGuard } from 'src/common/guards/authentication';
import { RolesGuard } from 'src/common/guards/authorization';
import { EnumRole } from 'src/common';
import { Auth } from 'src/common/decorators/authDecorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async signUp(@Body() body: UserDto): Promise<object> {
    return await this.authService.SignUpService(body);
  }

  @Post('confrimEmail')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async ConfrimEmail(@Body() body: confrimDto) {
    return await this.authService.ConfrimEmailService(body);
  }

  @Post('login')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async Login(@Body() body: LoginDto): Promise<object> {
    return await this.authService.LoginService(body);
  }

  @Get('profile')
  @Auth()
  @HttpCode(201)
  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  Profile(@Req() req: Request): object {
    return this.authService.getProfileService(req);
  }
}
