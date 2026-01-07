import { Controller, Post, Body } from '@nestjs/common';
import { EmailSignupService } from './email-signup.service';
import { CreateEmailSignupDto } from './dto/create-email-signup.dto';

@Controller('email-signup')
export class EmailSignupController {
  constructor(private readonly emailSignupService: EmailSignupService) {}

  @Post()
  create(@Body() dto: CreateEmailSignupDto) {
    return this.emailSignupService.create(dto);
  }
}
