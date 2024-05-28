// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async sign(payload: { email: string; sub: string; role: string }) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async verify(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.jwtService.verify(token);
      const currentTime = Date.now() / 1000; // 获取当前时间戳（秒）
      const expirationTime = decoded.exp; // 获取令牌过期时间戳
      // 如果当前时间大于过期时间,则令牌已过期
      return currentTime > expirationTime;
    } catch (err) {
      // 如果解析令牌失败,则视为过期
      return true;
    }
  }

  checkRole(roles: string[], token: string): boolean {
    try {
      const { role } = this.jwtService.verify(token);
      return roles.includes(role);
    } catch (error) {
      return false;
    }
  }

}
