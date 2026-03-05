import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryDTO, UpdateCategoryDTO } from './category.dto';
import type { File as MulterFile } from 'multer';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() categoryDTO: CategoryDTO,
    @UploadedFile() image: MulterFile,
  ) {
    return this.categoryService.create(categoryDTO, image);
  }

  @Get('/getCategory')
  async getCategories(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.categoryService.getCategories(Number(page), Number(pageSize));
  }

  @Get('/getAllCategories')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Delete('deleteCategory/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Post('updateCategory')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body(new ValidationPipe()) body: UpdateCategoryDTO,

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ fileIsRequired: false }),
    )
    image?: MulterFile,
  ) {
    return this.categoryService.update(body, image);
  }
}
