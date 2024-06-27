import { Controller, Get } from '@nestjs/common';
import { Public } from './decorator/public.decorator';
import axios from 'axios';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';

@Controller()
export class AppController {
    @Public()
    @Get()
    index() {
        return 'welcome visit nestjs backend';
    }
    @Public()
    @Get('wallpaper')
    wallpaper() {
        const path = resolve(process.cwd(), './public/hotPic');
        return readdirSync(path).slice(0, 20);
    }

    @Public()
    @Get('hitokoto')
    async hitokoto() {
        return await axios
            .get('https://v1.hitokoto.cn/')
            .then((res) => res.data);
    }
}
