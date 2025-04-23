import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/authentication';
import { RolesGuard } from '../guards/authorization';
import { EnumRole } from '../types/types';

export function Auth(...roles: EnumRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles || []),
    UseGuards(AuthGuard, RolesGuard),
  );
}
