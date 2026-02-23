import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { ContactDTO } from './contact.dto';
import { ContactService } from './contact.service';
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/form')
  create(@Body() dto: ContactDTO) {
    return this.contactService.create(dto);
  }

  @Get('/form')
  getContactForms() {
    return this.contactService.getContactForms();
  }

  @Delete('/deleteContact/:id')
  deleteContactForm(@Param('id') id: string) {
    return this.contactService.deleteContactForm(id);
  }
}
