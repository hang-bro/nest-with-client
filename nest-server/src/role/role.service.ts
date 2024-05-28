import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import paginateWithSearchParams from '../utils/paginateWithSearchParams';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll() {
    return await this.prismaService.role.findMany();
  }

  async list(query: IQuery) {
    const data = paginateWithSearchParams(query, ['name', 'remark','key']);
    const roles = await this.prismaService.role.findMany({
      ...data,
    });
    return {
      rows: roles,
      total: await this.prismaService.role.count(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
