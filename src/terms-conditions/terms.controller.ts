import { Controller, Post, Body, Get } from '@nestjs/common';
import { TermsConditionsService } from './terms.service';
import { TermsConditionsDTO } from './terms.dto';

@Controller('terms-conditions')
export class TermsConditionsController {
  constructor(private readonly termsConditionService: TermsConditionsService) {}

  @Post()
  create(@Body() dto: TermsConditionsDTO) {
    return this.termsConditionService.create(dto);
  }

  @Get('/getText')
  getTermsText() {
    return this?.termsConditionService?.getTermsData();
  }
}
