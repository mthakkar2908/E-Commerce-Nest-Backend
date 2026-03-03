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
import { ContactDTO, UpdateContactDTO } from './contact.dto';
import { ContactService } from './contact.service';
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/form')
  create(@Body() dto: ContactDTO) {
    return this.contactService.create(dto);
  }

  @Put('updateContact')
  update(@Body() dto: UpdateContactDTO) {
    return this.contactService.update(dto);
  }

  @Get('/form')
  async getContactForms(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.contactService.getContactForms(Number(page), Number(pageSize));
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.contactService.searchContacts(
      query,
      Number(page),
      Number(pageSize),
    );
  }
  @Delete('/deleteContact/:id')
  deleteContactForm(@Param('id') id: string) {
    return this.contactService.deleteContactForm(id);
  }
}
