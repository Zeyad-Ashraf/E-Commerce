import { Module } from '@nestjs/common';
import { AuthRepoServices, UserModel } from '../../DB/index';
import { AuthService } from './user.service';
import { AuthController } from './user.controller';
import {
  EncryptionServices,
  HashingServices,
  TokenServices,
} from 'src/common/index';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [
    AuthRepoServices,
    AuthService,
    HashingServices,
    EncryptionServices,
    JwtService,
    TokenServices,
  ],
  exports: [
    AuthRepoServices,
    UserModel,
    HashingServices,
    EncryptionServices,
    JwtService,
  ],
})
export class AuthModule {}
