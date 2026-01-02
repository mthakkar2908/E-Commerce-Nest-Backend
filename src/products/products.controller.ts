import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDTO } from './create-product.dto';
import { UpateProductDTO } from './updateProduct.dto';
import { Products } from './products.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAllProducts() {
    try {
      return this.productService.findAllProducts();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Internal Error',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get('searchProducts')
  async searchProducts(@Query('q') q: string): Promise<Products[]> {
    return this.productService.searchProducts(q);
  }

  @Get(':id')
  fineProductById(@Param('id') id: string) {
    try {
      return this.productService.fineProductById(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error ?? 'Internal Server Error',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Post('createProduct')
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() body: CreateProductDTO) {
    const product = await this.productService.CreateProduct(
      body.name,
      body.about_product,
      body.price,
      body.quan,
      body.is_fav,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product created successfully',
      data: product,
    };
  }

  @Put('updateProduct')
  async updateProduct(@Body() body: UpateProductDTO) {
    const product = await this.productService.updateProduct(body.id, body);

    return {
      statusCode: HttpStatus.OK,
      message: 'Product Updated Successfully',
      data: product,
    };
  }

  @Patch(':id')
  toggleFavorite(@Param('id') id: string) {
    return this.productService.toggleFavorite(id);
  }
}
