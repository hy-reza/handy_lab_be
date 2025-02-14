import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the roles from the decorator
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // Get the user from the request object
    const user = request.user;
    console.log({ message: 'ini log dari roles guard', user });

    const isAuthorized = requiredRoles.includes(user.role);
    if (!isAuthorized) {
      throw new UnauthorizedException({
        meta: {
          isSuccess: false,
          message:
            'Access denied! You are not authorized to access this resource',
        },
      });
    }

    return isAuthorized;
  }
}
