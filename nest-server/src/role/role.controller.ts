import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

import { RoleGuard } from '../guard/role.guard';
import { Role } from '../decorator/role.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/decorator/permission.decorator';

@Controller('role')
@ApiTags('角色接口')
// @UseGuards(RoleGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }
  @Role(['user', 'admin'])
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Role(['user', 'admin'])
  @Get('list')
  list(@Query() query: IQuery) {
    return this.roleService.list(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
