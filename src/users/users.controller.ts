import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './create-user.dto';
import { SignInDTO } from './signIn.dto';
import { UpdateUserDTO } from './update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateUserDTO) {
    try {
      return this.usersService.create(body.name, body.email, body.password);
    } catch (error) {
      return error;
    }
  }

  @Post('signIn')
  async signIn(@Body() body: SignInDTO) {
    try {
      const user = await this.usersService.signIn(body.email, body.password);

      return { message: 'Logged In Successfully.', user };
    } catch (error) {
      return error;
    }
  }

  @Post('updateProdile/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProdile(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ fileIsRequired: false }),
    )
    image?: MulterFile,
  ) {
    try {
      return this?.usersService?.updateProfile(
        id,
        body?.name,
        body?.email,
        image,
      );
    } catch (error) {
      return error;
    }
  }
}
