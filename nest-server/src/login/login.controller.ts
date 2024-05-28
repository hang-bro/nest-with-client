import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { CreateLoginDto } from './dto/create-login.dto';
import { LoginService } from './login.service';
import { Public } from '../decorator/public.decorator';
@Controller('login')
@ApiTags('登录接口')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Public()
  @Post()
  login(
    @Body(new ValidationPipe()) createLoginDto: CreateLoginDto,
    @Session() session,
  ) {
    const { captcha } = createLoginDto;
    if (
      !session.captcha ||
      captcha.toUpperCase() != session.captcha.toUpperCase()
    ) {
      throw new BadRequestException('验证码错误');
    }
    return this.loginService.login(createLoginDto);
  }

  @Get('getInfo')
  getInfo(@Req() req: Request) {
    const token = req.headers['authorization'];
    return this.loginService.getInfo(token);
  }
  @Public()
  @Get('captcha')
  captcha(@Res() res: Response, @Session() session: Record<string, any>) {
    const captcha = this.loginService.captcha();
    session.captcha = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
