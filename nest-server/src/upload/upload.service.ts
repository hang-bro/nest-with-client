import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import * as fs from 'fs';
import { mkdirSync } from 'fs';
import { join, resolve } from 'path';
@Injectable()
export class UploadService {
  tempPath = join(process.cwd(), 'public/upload/temp');
  tempSavePath = join(process.cwd(), 'public/upload/slice');

  uploadFile(file) {
    // console.log(`file ==>`, file);
    // const allowedMimeTypes = ['image/jpeg', 'image/png']; // 设置允许上传的文件类型

    // if (!allowedMimeTypes.includes(file.mimetype)) {
    //   throw new UnsupportedMediaTypeException(`不支持${file.mimetype}格式`);
    // }

    return `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/static/upload/images/${file.filename}`;
  }

  uploadSlice(file) {
    if (!fs.existsSync(this.tempPath)) fs.mkdirSync(this.tempPath);

    const [index, fileName, ext] = file.originalname.split('.');

    // 将切片的文件上传到临时目录中
    const sliceDir = `${this.tempPath}/${fileName}`;

    if (!fs.existsSync(sliceDir)) fs.mkdirSync(sliceDir);

    // 将分片文件从 temp 中移动到本次上传大文件的临时目录
    fs.renameSync(file.path, `${sliceDir}/${index}`); //可以将图片默认上传位置移动到你想存放的位置，可以减少文件数量
  }
  uploadSliceMerge(file: string) {
    const [name] = file.split('.');
    const mergePath = `${this.tempPath}/${name}`;
    // 获取所有切片文件
    const chunks = fs.readdirSync(mergePath);

    chunks.sort((a, b) => +a - +b); // 排序一下  防止意外事件

    // 文件最终保存的文件夹
    if (!fs.existsSync(this.tempSavePath)) mkdirSync(this.tempSavePath);

    // 合并文件
    chunks.map((path) => {
      fs.appendFileSync(
        `${this.tempSavePath}/${file}`,
        fs.readFileSync(`${mergePath}/${path}`),
      );
    });

    // 删除切片临时文件夹
    fs.rmSync(mergePath, { recursive: true });
    return {
      url: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/static/upload/slice/${file}`,
    };
  }
}
