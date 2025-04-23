import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenServices {
  constructor(private readonly jwtService: JwtService) {}

  async GenerateToken(
    payload: object,
    options: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, options);
  }

  async VerifyToken(
    payload: string,
    options: JwtVerifyOptions,
  ): Promise<object> {
    return await this.jwtService.verifyAsync(payload, options);
  }
}
