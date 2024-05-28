import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';
import { Public } from '../decorator/public.decorator';
import { join } from 'node:path/posix';
import { readdirSync } from 'fs';

@Controller('user')
@ApiTags('用户接口')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('bannerList')
  async bannerList() {
    function getRandomElements(arr: any[]) {
      // 创建一个新数组来存储随机元素
      const randomElements = [];

      // 使用 Set 存储已选择的索引，以避免重复
      const selectedIndices = new Set();

      // 循环 10 次
      while (selectedIndices.size < 10) {
        // 生成随机索引
        const randomIndex = Math.floor(Math.random() * arr.length);

        // 如果索引还未被选择，则将其添加到 Set 中
        if (!selectedIndices.has(randomIndex)) {
          selectedIndices.add(randomIndex);
          randomElements.push(arr[randomIndex]);
        }
      }

      return randomElements;
    }
    const url = join(process.cwd(), 'public/hotPic');
    const data = readdirSync(url).map((i) => {
      return {
        url: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/static/hotPic/${i}`,
      };
    });
    return getRandomElements(data);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: '用户注册',
  })
  register(@Body(new ValidationPipe()) userRegisterDto: UserRegisterDto) {
    return this.userService.register(userRegisterDto);
  }

  @Public()
  @Post('getEmailCode')
  @ApiOperation({
    summary: '获取邮箱验证码',
  })
  getEmailCode(@Body('email') email: string) {
    return this.userService.getEmailCode(email);
  }

  @Public()
  @ApiOperation({
    summary: '用户找回密码',
  })
  @Post('forgetPassword')
  forgetPassword(
    @Body(new ValidationPipe()) forgetPasswordDto: ForgetPasswordDto,
  ) {
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  @Post()
  @ApiOperation({
    summary: '创建用户',
  })
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: '获取用户',
    description: '获取所有的用户',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('list')
  @ApiOperation({
    summary: '分页获取用户',
  })
  list(@Query() query: IQuery) {
    return this.userService.list(query);
  }

  @Post('resetPwd')
  @ApiOperation({
    summary: '重置密码',
  })
  resetPwd(@Body('userId') id: string) {
    return this.userService.resetPwd(id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '这是id', required: true })
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
