import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateLoginDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度在6~20' })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @Length(4, 4, { message: '验证码长度必须为 4' })
  captcha: string;
}
