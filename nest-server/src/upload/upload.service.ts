import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Injectable()
export class UploadService {
  uploadFile(file) {
    console.log(`file ==>`,file);
    const allowedMimeTypes = ['image/jpeg', 'image/png']; // 设置允许上传的文件类型

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('文件格式不正确');
    }

    return `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/static/upload/images/${file.filename}`;
  }
}
