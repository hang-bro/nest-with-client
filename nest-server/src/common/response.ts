import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
interface Data<T> {
  data: T;
}

@Injectable()
export class Response<T> implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    const now = Date.now();
    // // 如果公共路由
    // if (isPublic) {
    //   return next /** */
    //     .handle()
    //     .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
    //     .pipe(map((data) => ({ data, code: 200 })));
    // }

    // // 检查是否携带 token
    // if (!authToken) {
    //   throw new UnauthorizedException('未授权');
    // }

    return next /** */
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)))
      .pipe(map((data) => ({ data, code: 200 })));
  }
}
