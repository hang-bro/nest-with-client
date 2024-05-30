import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  age: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  id: string;
}
