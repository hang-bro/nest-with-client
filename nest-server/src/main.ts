import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { join, resolve } from 'path';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import {} from 'swagger-ui-express';
import { Response } from './common/response';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
    // 获取环境变量
    const nodeEnv = process.env.NODE_ENV || 'development';
    // 加载对应环境的配置文件
    dotenv.config({
        path: resolve(
            process.cwd(),
            nodeEnv === 'development' ? '.env.development' : `.env.${nodeEnv}`,
        ),
    });

    /**服务器监听端口号 */
    const SERVER_PORT = process.env.SERVER_PORT;
    const isDev = (process.env.NODE_ENV || 'development') == 'development';

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

    app.use(
        cors({
            origin: [
                // 建议使用ip+端口
                'http://192.168.5.240:9527',
                'http://192.168.5.240:5173',
                'http://192.168.5.240:8848',
                // localhost 获取 session获取不到
                'http://localhost:8848',
                'http://localhost:9527',
                'http://localhost:5173',
                'http://localhost:4173',
            ],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        }),
    );

    // 设定接口前缀
    app.setGlobalPrefix('api');

    app.use(cookieParser());

    // session

    app.use(
        session({
            secret: 'hang',
            name: 'hang.session',
            resave: false,
            cookie: { maxAge: 60000, sameSite: 'strict' }, // Cookie的过期时间(单位毫秒)
        }),
    );

    // 设置全局过滤器
    // app.useGlobalFilters(new HttpFilter());

    // 设置全局拦截器
    // app.useGlobalInterceptors(new Response(new Reflector()));

    // 开启请求压缩
    app.use(compression());

    app.useGlobalPipes(new ValidationPipe());

    app.enableVersioning({ type: VersioningType.URI });

    app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/static' });

    // 开启swagger文档(可选)
    if (isDev) {
        const options = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('hang')
            .setDescription('Hang description')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('/api-docs', app, document);
    }

    await app.listen(SERVER_PORT, () => {
        function getRandomColor(): string {
            const colorCode = Math.floor(Math.random() * 256);
            return `\x1b[38;5;${colorCode}m`;
        }

        function logWithRandomColor(message: string): void {
            const randomColor = getRandomColor();
            console.log(`${randomColor}%s\x1b[0m`, message);
        }
        const str = `
        .##.....##....###....##....##..######...........########..########...#######.
        .##.....##...##.##...###...##.##....##..........##.....##.##.....##.##.....##
        .##.....##..##...##..####..##.##................##.....##.##.....##.##.....##
        .#########.##.....##.##.##.##.##...####.#######.########..########..##.....##
        .##.....##.#########.##..####.##....##..........##.....##.##...##...##.....##
        .##.....##.##.....##.##...###.##....##..........##.....##.##....##..##.....##
        .##.....##.##.....##.##....##..######...........########..##.....##..#######.
        `;
        logWithRandomColor(str);
        if (isDev) {
            console.log(
                `swagger at ==> http://localhost:${SERVER_PORT}/api-docs`,
            );
        }

        console.log(`server start at http://localhost:${SERVER_PORT}/api`);
    });
}

bootstrap();

