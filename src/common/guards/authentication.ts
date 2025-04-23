import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepoServices } from 'src/DB';
import { EncryptionServices } from '../security';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly authReop: AuthRepoServices,
    private readonly encryptionServices: EncryptionServices,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'] as string;
    if (!auth) throw new UnauthorizedException('invalid token');
    let token: string | undefined = undefined;
    let prefix: string | undefined = undefined;
    let secret: string | undefined = undefined;
    [prefix, token] = auth.split(' ');
    if (!prefix || !token) throw new UnauthorizedException('invalid token');
    if (prefix === 'Bearer') secret = process.env.JWT_SECRET_ACCESS_USER;
    else if (prefix === 'Admin') secret = process.env.JWT_SECRET_ACCESS_ADMIN;
    try {
      const payload: object = await this.jwtService.verifyAsync(token, {
        secret,
      });
      if (!payload['id']) throw new UnauthorizedException('invalid token');
      const User = await this.authReop.findById(payload['id']);
      if (!User) throw new UnauthorizedException('invalid token');
      User.phone = await this.encryptionServices.Decryption(User.phone);
      request['user'] = User;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
