import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  age?: string;

  @ApiProperty()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度在6~20' })
  password: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  id?: string;

  createTime?: string;
  updateTime?: string;
}
