import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    try {
      return this.postsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.postsService.findOne(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Inetnal Error',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ValidationPipe()) body: CreatePostDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ fileIsRequired: false }),
    )
    image?: MulterFile,
  ) {
    return this.postsService.create(
      body.userId,
      body.name,
      body.post_description,
      body.email,
      image,
    );
  }

  @Post('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: CreatePostDto,

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ fileIsRequired: false }),
    )
    image?: MulterFile,
  ) {
    return this.postsService.update(
      id,
      body.userId,
      body.name,
      body.post_description,
      body.email,
      image,
    );
  }

  @Delete('deletePost/:id')
  async delete(@Param('id') id: string) {
    try {
      const deletedPost = await this.postsService.delete(id);
      return {
        message: 'Post deleted successfully',
        data: deletedPost,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error || 'Failed to delete post',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
