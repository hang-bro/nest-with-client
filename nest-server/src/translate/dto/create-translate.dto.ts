import { IsNotEmpty } from 'class-validator';

export class CreateTranslateDto {
  @IsNotEmpty({ message: '输入对象不能为空' })
  inputObj: string;

  isTest?: string;
}
