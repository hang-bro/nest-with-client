import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度在6~20' })
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password is too weak',
  // })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @Length(6, 6, { message: '验证码长度必须为 6' })
  code: string;
}
