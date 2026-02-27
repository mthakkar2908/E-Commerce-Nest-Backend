import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import { ContactDTO } from './contact.dto';
import { ContactService } from './contact.service';
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/form')
  create(@Body() dto: ContactDTO) {
    return this.contactService.create(dto);
  }

  @Put('updateContact')
  update(@Body() dto: ContactDTO) {
    return this.contactService.update(dto);
  }

  @Get('/form')
  getContactForms() {
    return this.contactService.getContactForms();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.contactService.searchContacts(query);
  }

  @Delete('/deleteContact/:id')
  deleteContactForm(@Param('id') id: string) {
    return this.contactService.deleteContactForm(id);
  }
}
