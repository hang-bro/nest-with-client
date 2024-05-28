import { AuthService } from './auth.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;
    const requestPath = request.url; // 获取请求路径
    const requestMethod = request.method; // 获取请求方法
    const startTime = Date.now();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const roles = this.reflector.get<string[]>('role', context.getHandler());

    const _next = () => {
      return next /** */
        .handle()
        .pipe(
          tap(() => {
            const str = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] [${requestMethod.toUpperCase()}] ${requestPath} -- ${(Date.now() - startTime).toFixed(2)}ms`;
            console.log(str);
          }),
        )
        .pipe(map((data) => ({ data, code: 200, message: 'success' })));
    };

    // 如果路由是公开的,则不需要检查 token
    if (isPublic) return _next();

    // 检查是否携带 token
    if (!authToken) {
      throw new UnauthorizedException(`未授权`);
    }

    // 验证 token 是否过期
    const isTokenExpired = this.authService.isTokenExpired(authToken);
    if (isTokenExpired) {
      throw new UnauthorizedException(`Token expired for ${requestPath}`);
    }

    // permission
    if (roles) {
      // 如果路由需要权限字符
      if (!this.authService.checkRole(roles, authToken)) {
        throw new UnauthorizedException(`无权限`);
      } else {
        // 继续处理请求
        return _next();
      }
    }

    // 继续处理请求
    return _next();
  }
}
