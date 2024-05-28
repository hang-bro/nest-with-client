/*
 * @Description:
 * @Author: HYH
 * @LastEditors: HYH
 * @LastEditTime: 2023-07-07 14:54:51
 */
import { Global, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Global()
@Injectable()
export class CryptoService {
  /** 密码加密  */
  async encrypt(password: string) {
    const saltRounds = 10; // 加盐的迭代次数
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  /**密码校验 */
  async compare(password: string, dbPassword: string) {
    return await bcrypt.compare(password, dbPassword);
  }
}
