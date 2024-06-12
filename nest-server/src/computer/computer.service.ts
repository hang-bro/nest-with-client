import { Injectable } from '@nestjs/common';
import * as os from 'os';
@Injectable()
export class ComputerService {
  constructor() {}
  getComputerInfo() {
    const totalMemory = os.totalmem() / 1024 ** 3; // 总内存(GB)
    const freeMemory = os.freemem() / 1024 ** 3; // 可用内存(GB)
    const usedMemory = totalMemory - freeMemory; // 已使用内存(GB)
    return {
      system: os.type(),
      architecture: os.arch(),
      cpus: os.cpus().length,
      totalMemory: totalMemory.toFixed(2),
      freeMemory: freeMemory.toFixed(2),
      usedMemory: usedMemory.toFixed(2),
    };
  }
}
