import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { ComputerService } from './computer.service';

@Controller('computer')
@ApiTags('computer信息')
export class ComputerController {
  constructor(private readonly computerService: ComputerService) {}

  @Get()
  getComputerInfo() {
    return this.computerService.getComputerInfo();
  }
}
