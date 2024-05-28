import { ConflictException, Global, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
type EmailData = {
  to: string;
  subject: string;
  text: string;
  html: string;
  code: string;
  type?: string;
};

@Global()
@Injectable()
export class MailerService {
  /**验证码过期时间 */
  private codeExpireTime: number = 60 * 1000;
  constructor(private readonly prismaService: PrismaService) {}

  async send(emailData: EmailData) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const record = await this.prismaService.emailSendHistory.findUnique({
      where: { email: emailData.to },
    });

    if (!record) {
      const data = {
        email: emailData.to,
        type: emailData.type,
        code: emailData.code,
        expiresAt: new Date(Date.now() + this.codeExpireTime).getTime() + '',
      };
      await this.prismaService.emailSendHistory.create({ data });
    } else {
      // 验证码还未过期
      if (+record.expiresAt > Date.now()) {
        throw new ConflictException('请求过于频繁,请稍后再试');
      }
      await this.prismaService.emailSendHistory.update({
        where: { email: emailData.to },
        data: {
          code: emailData.code,
          expiresAt: new Date(Date.now() + this.codeExpireTime).getTime() + '',
        },
      });
    }

    return await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      ...emailData,
    });
  }
}
