import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { GithubService } from './github.service';

@Controller('github')
@ApiTags('角色接口')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('log')
  log() {
    return this.githubService.log();
  }
}
