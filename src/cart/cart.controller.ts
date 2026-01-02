import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddMultiplsCarts, AddQuantityDTO } from './create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/add')
  async addToCart(
    @Param('userId') userId: string,
    @Body() data: AddMultiplsCarts,
  ) {
    const Cart = await this.cartService.addToCart(userId, data);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cart Added.!',
      data: Cart,
    };
  }

  @Post('addQuan')
  async addQuanity(@Body() data: AddQuantityDTO) {
    const addQuan = await this.cartService.addQuantity(data);

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Quantity Added.',
      data: addQuan,
    };
  }
}
