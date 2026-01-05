import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './create-order.dto';
import { UpdateOrderDTO } from './update-order.dto';
import { Orders } from './orders.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  getAllOrders() {
    try {
      return this.orderService.getAllOrders();
    } catch (error) {
      throw new error();
    }
  }
  @Get('searchOrders')
  async searchOrders(@Query('o') o: string): Promise<Orders[]> {
    return this.orderService.searchOrders(o);
  }

  @Get(':id')
  getAllOrdersById(@Param('id') id: string) {
    try {
      return this.orderService.getOrdersById(id);
    } catch (error) {
      throw new error();
    }
  }

  @Delete('deleteOrder/:id')
  deleteOrderById(@Param('id') id: string) {
    try {
      return this.orderService?.deleteOrderById(id);
    } catch (error) {
      throw new error();
    }
  }

  @Post('createOrder')
  async createOrder(@Body() body: CreateOrderDTO) {
    const order = await this.orderService.CreateOrder(body);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order Created Successfully',
      data: order,
    };
  }

  @Put('updateOrder')
  async updateOrder(@Body() body: UpdateOrderDTO) {
    const updateedOrder = await this.orderService.UpdateOrdder(body.id, body);

    return {
      statusCode: HttpStatus.OK,
      message: 'Order Updated',
      data: updateedOrder,
    };
  }
}
