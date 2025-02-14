import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check if the request has an authorization header
    if (!authHeader) {
      throw new UnauthorizedException({
        meta: {
          isSuccess: false,
          message: 'Access denied! Missing token',
        },
      });
    }
    const token = authHeader.split(' ')[1];

    // Check if the token is valid
    if (!token) {
      throw new UnauthorizedException({
        meta: {
          isSuccess: false,
          message: 'Access denied! Invalid token',
        },
      });
    }

    try {
      const decoded = this.jwtService.verify(token);
      console.log({ message: 'Ini log dari auth guard', token, decoded });
      request.user = decoded;
    } catch (error) {
      throw new UnauthorizedException({
        meta: {
          isSuccess: false,
          message: error.message,
        },
      });
    }
    return true;
  }
}
