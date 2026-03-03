import { Controller, Post, Body, Delete, Get, Query } from '@nestjs/common';
import { EmailSignupService } from './email-signup.service';
import { CreateEmailSignupDto } from './dto/create-email-signup.dto';

@Controller('email-signup')
export class EmailSignupController {
  constructor(private readonly emailSignupService: EmailSignupService) {}

  @Post()
  create(@Body() dto: CreateEmailSignupDto, @Query('type') type?: string) {
    return this.emailSignupService.create(dto, type);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.emailSignupService.findAll(page, pageSize);
  }

  @Get('get-emails')
  find(@Query('userId') userId: string) {
    return this.emailSignupService.findByUserId(userId);
  }

  @Delete('unSubscribe')
  delete(@Body() dto: CreateEmailSignupDto) {
    return this.emailSignupService.delete(dto);
  }
}
