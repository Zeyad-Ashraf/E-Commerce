import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EnumRole } from '../index';

interface RequestOfUser {
  role?: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<EnumRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as RequestOfUser;
    if (!user || !requiredRoles.some((item) => user.role?.includes(item)))
      throw new BadRequestException(`Don't have permission`);

    return true;
  }
}
