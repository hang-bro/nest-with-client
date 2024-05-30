import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFile(file) {
    console.log(`file ==>`, file);
    const allowedMimeTypes = ['image/jpeg', 'image/png']; // 设置允许上传的文件类型

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException(`不支持${file.mimetype}格式`);
    }

    return `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/static/upload/images/${file.filename}`;
  }
}
