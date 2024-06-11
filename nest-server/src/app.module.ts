import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { LoginModule } from './login/login.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { TranslateModule } from './translate/translate.module';
import { GithubModule } from './github/github.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule,
    AuthModule,
    UserModule,
    UploadModule,
    LoginModule,
    RoleModule,
    PrismaModule,
    CryptoModule,
    TranslateModule,
    GithubModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
