import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as svgCaptcha from 'svg-captcha';
import { AuthService } from './../auth/auth.service';
import { CreateLoginDto } from './dto/create-login.dto';
@Injectable()
export class LoginService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly authService: AuthService,
  ) {}

  async login(createLoginDto: CreateLoginDto) {
    const { email, password } = createLoginDto;

    const user = await this.prismaService.user.findUnique({
      where: { email: createLoginDto.email },
    });

    if (user && (await this.cryptoService.compare(password, user.password))) {
      const token = await this.authService.sign({
        email,
        sub: user.id,
        role: user.role,
      });
      return { token };
    } else throw new NotFoundException(`邮箱或密码错误`);
  }

  async getInfo(token: string) {
    try {
      const decoded = await this.authService.verify(token);
      const { password, ...info } = await this.prismaService.user.findUnique({
        where: { id: decoded.sub },
      });
      const role = await this.prismaService.role.findUnique({
        where: { key: decoded.role },
      });
      return { ...info, role };
    } catch (error) {
      throw new UnauthorizedException('token已失效,请重新登录');
    }
  }

  captcha() {
    return svgCaptcha.create({
      noise: 2,
      size: 4,
      width: 150,
      height: 40,
      fontSize: 50,
      charPreset: '0123456789', // 指定字符集为纯数字
    });
  }
}
