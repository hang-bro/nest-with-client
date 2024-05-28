import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { CreateTranslateDto } from './dto/create-translate.dto';
type IResult = {
  enTrans: Record<string, string>;
  jaTrans: Record<string, string>;
};

export type ITo = 'ja' | 'en';
@Injectable()
export class TranslateService {
  async translate(createTranslateDto: CreateTranslateDto) {
    const { inputObj, isTest } = createTranslateDto;
    const result: IResult = {
      enTrans: {},
      jaTrans: {},
    };

    Object.keys(inputObj).forEach((key) => {
      result.enTrans[key] = key;
      result.jaTrans[key] = key;
    });

    if (isTest) {
      return this.generateComment(result);
    }

    /********************** 英文翻译 ************************/
    const enTransKeys = Object.keys(result.enTrans);
    for (let i = 0; i < enTransKeys.length; i++) {
      const key = enTransKeys[i];
      const trans = await this.baiduTranslate(key, 'en');
      result.enTrans[key] = trans;
      console.log(`英文翻译 ==>`, key, `${i + 1}/${enTransKeys.length}`);
    }
    /********************** 日语翻译 ************************/
    const jpTransKeys = Object.keys(result.jaTrans);
    for (let i = 0; i < jpTransKeys.length; i++) {
      const key = jpTransKeys[i];
      const trans = await this.baiduTranslate(key, 'jp');
      result.jaTrans[key] = trans;
      console.log(`日语翻译 ==>`, key, `${i + 1}/${jpTransKeys.length}`);
    }
    return this.generateComment(result);
  }

  async baiduTranslate(query: string, to: 'jp' | 'en' = 'en'): Promise<string> {
    return new Promise((resolve) => {
      const salt = Math.random();
      const md5 = crypto.createHash('md5');
      const apiUrl = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
      const appid = process.env.BAIDU_TRANS_APPID;
      const secret = process.env.BAIDU_TRANS_SECRET;
      const sign = md5.update(appid + query + salt + secret).digest('hex');
      const params = {
        q: query,
        from: 'zh',
        to,
        salt,
        appid,
        sign,
      };

      axios
        .get(apiUrl, {
          params,
          timeout: 60000,
        })
        .then((res) => {
          setTimeout(() => {
            resolve(res.data.trans_result[0]?.dst);
          }, 1000);
        });
    });
  }

  generateComment(result: IResult) {
    console.log(`result ==>`, result);
    const createStr = (obj: Record<string, string>) => {
      const startStr = `{\n`;
      const endStr = `}`;
      let str = '';
      Object.keys(obj).forEach((key) => {
        str += `  /** ${key} */\n`;
        str += `  "${[key]}":"${obj[key]}",\n`;
      });

      return startStr + str + endStr;
    };

    return {
      enTrans: createStr(result.enTrans),
      jaTrans: createStr(result.jaTrans),
    };
  }
}
