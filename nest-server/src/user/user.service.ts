import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import paginateWithSearchParams from '../utils/paginateWithSearchParams';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { MailerService } from '../mailer/mailer.service';
import { join } from 'path';
import { readFileSync } from 'fs';
import { UserRegisterDto } from './dto/user-register.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly mailerService: MailerService,
  ) {}

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { code } = await this.prismaService.emailSendHistory.findUnique({
      where: { email: forgetPasswordDto.email },
    });

    if (forgetPasswordDto.code != code) {
      throw new BadRequestException('验证码错误');
    }

    return await this.prismaService.user.update({
      where: { email: forgetPasswordDto.email },
      data: {
        password: await this.cryptoService.encrypt(forgetPasswordDto.password),
      },
    });
  }

  async register(userRegisterDto: UserRegisterDto) {
    // 判断邮箱是否注册
    if (await this.ifEmailRegisted(userRegisterDto.email)) {
      throw new ConflictException('邮箱已注册,请找回密码或直接登录');
    }

    const { code } = await this.prismaService.emailSendHistory.findUnique({
      where: { email: userRegisterDto.email },
    });

    if (userRegisterDto.code != code) {
      throw new BadRequestException('验证码错误');
    }

    await this.prismaService.user.create({
      data: {
        email: userRegisterDto.email,
        password: await this.cryptoService.encrypt(userRegisterDto.password),
      },
    });
  }

  /**判断邮箱是否注册 */
  async ifEmailRegisted(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async getEmailCode(email: string) {
    // // 判断邮箱是否注册
    // if (await this.ifEmailRegisted(email)) {
    //   throw new ConflictException('邮箱已注册,请找回密码或直接登录');
    // }
    const htmlPath = join(process.cwd(), 'src/mailer/templates/code.html');

    const html = readFileSync(htmlPath, { encoding: 'utf8' });

    const code = Math.random().toString().slice(2, 8);

    const emailData = {
      to: email,
      subject: '验证码',
      text: '',
      html: html.replace('{{code}}', code),
      code,
    };

    await this.mailerService.send(emailData);
  }

  async resetPwd(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        password: await this.cryptoService.encrypt('123456'),
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { password, id, createTime, updateTime, ...user } = createUserDto;
    try {
      await this.prismaService.user.create({
        data: {
          ...user,
          password: await this.cryptoService.encrypt(password),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async list(query: IQuery) {
    const data = paginateWithSearchParams(query, ['username', 'email']);
    const users = await this.prismaService.user.findMany({
      ...data,
      orderBy: { createTime: 'asc' },
    });
    return {
      rows: users.map(({ password, ..._ }) => ({ ..._ })),
      total: await this.prismaService.user.count(),
    };
  }

  findOneById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { ...user } = updateUserDto;
    return this.prismaService.user.update({
      where: { id },
      data: user,
    });
  }

  remove(id: string) {
    return this.prismaService.user.deleteMany({
      where: {
        id: {
          in: id.split(','),
        },
        NOT: {
          role: 'admin',
        },
      },
    });
  }
}
