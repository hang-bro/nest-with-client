import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { ComputerService } from './computer.service';

@Module({
  controllers: [ComputerController],
  providers: [ComputerService],
})
export class ComputerModule {}
