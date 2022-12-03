import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor  } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { extractToken } from '../_handlers/jwt.extract';

@Injectable()
export class AuthInterceptor implements NestInterceptor  {
  constructor(/*private userService: UserService*/){}
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = extractToken(request);

    if (token) {
      const decoded: any = jwt.verify(token, process.env.CRYPT);
      const user = decoded.sub;

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      request['user'] = user;
      return next.handle();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
