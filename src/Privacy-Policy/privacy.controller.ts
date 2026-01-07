import { Controller, Post, Body, Get } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy.service';
import { PrivacyPolicyDTO } from './privacy.dto';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Post()
  create(@Body() dto: PrivacyPolicyDTO) {
    return this.privacyPolicyService.create(dto);
  }

  @Get('/getText')
  getPrivacyText() {
    return this?.privacyPolicyService?.getPrivacyText();
  }
}
