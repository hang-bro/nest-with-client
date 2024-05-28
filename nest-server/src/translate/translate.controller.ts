import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { CreateTranslateDto } from './dto/create-translate.dto';

@Controller('translate')
export class TranslateController {
  constructor(private translateService: TranslateService) {}
  @Post()
  async translate(
    @Body(new ValidationPipe()) createTranslateDto: CreateTranslateDto,
  ) {
    return this.translateService.translate(createTranslateDto);
  }
}
