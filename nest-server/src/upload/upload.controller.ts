import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { zip } from 'compressing';
import { Response } from 'express';
import { join } from 'path';
import { UploadService } from './upload.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { readdirSync } from 'fs';

@Controller('upload')
@ApiTags('上传接口')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/static/upload/images/${file.filename}`;
  }

  @Public()
  @Get('download')
  download(@Res() res: Response) {
    const url = join(__dirname, '../../public/hotPic/wallhaven-1pgk23.jpg');
    res.download(url);
  }

  @Public()
  @Get('stream')
  async stream(@Res() res: Response) {
    const url = join(__dirname, '../../public/hotPic/wallhaven-1pgk23.jpg');
    const stram = new zip.Stream();
    await stram.addEntry(url);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=hang');
    stram.pipe(res);
  }
}
