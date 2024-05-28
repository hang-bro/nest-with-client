import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private Reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const admin = this.Reflector.get<string[]>('role', context.getHandler());

    const ctx = context.switchToHttp();

    const req = ctx.getRequest<Request>();

    // const res = ctx.getResponse<Response>();

    // const next = ctx.getNext<NextFunction>();

    if (admin.includes(req.query?.role as string)) {
      return true;
    }
    return false;
  }
}
