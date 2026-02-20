import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { TermsConditionsService } from './terms.service';
import { TermsConditionsDTO } from './terms.dto';

@Controller('terms-conditions')
export class TermsConditionsController {
  constructor(private readonly termsConditionService: TermsConditionsService) {}

  @Post()
  create(@Body() dto: TermsConditionsDTO) {
    return this.termsConditionService.createOrUpdate(dto);
  }

  @Get('/getText')
  getTermsText() {
    return this?.termsConditionService?.getTermsData();
  }

  @Delete('/delete-terms/:id')
  deleteTerms(@Param('id') id: string) {
    return this.termsConditionService.deleteTerms(id);
  }
}
