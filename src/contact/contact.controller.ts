import { Controller, Post, Body } from '@nestjs/common';
import { ContactDTO } from './contact.dto';
import { ContactService } from './contact.service';
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/form')
  create(@Body() dto: ContactDTO) {
    return this.contactService.create(dto);
  }
}
