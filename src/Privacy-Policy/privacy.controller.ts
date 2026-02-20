import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy.service';
import { PrivacyPolicyDTO } from './privacy.dto';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Post()
  create(@Body() dto: PrivacyPolicyDTO) {
    return this.privacyPolicyService.createOrUpdate(dto);
  }

  @Get('/getText')
  getPrivacyText() {
    return this?.privacyPolicyService?.getPrivacyText();
  }

  @Delete('/delete-privacy/:id')
  deletePrivacy(@Param('id') id: string) {
    return this.privacyPolicyService.deletePrivacy(id);
  }
}
