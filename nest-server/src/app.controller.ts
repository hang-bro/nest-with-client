import { Controller, Get } from '@nestjs/common';
import { Public } from './decorator/public.decorator';
import axios from 'axios';

@Controller()
export class AppController {
  @Public()
  @Get()
  index() {
    return 'welcome visit nestjs backend';
  }

  @Public()
  @Get('hitokoto')
  async hitokoto() {
    return await axios.get('https://v1.hitokoto.cn/').then((res) => res.data);
  }
}
