import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import { Model } from 'mongoose';
import { CreateOrderDTO } from './create-order.dto';
import { User } from 'src/users/user.schema';
import { Products } from 'src/products/products.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<Orders>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Products.name) private productModel: Model<Products>,
  ) {}

  async getAllOrders(): Promise<Orders[]> {
    return this.orderModel.find().populate('product_id').exec();
  }

  async getOrdersById(id: string): Promise<Orders | null> {
    return this.orderModel.findById(id).populate('product_id').exec();
  }

  async deleteOrderById(id: string): Promise<Orders | null> {
    return this.orderModel.findByIdAndDelete(id).populate('product_id').exec();
  }

  async CreateOrder(createOrder: CreateOrderDTO): Promise<Orders> {
    const user = await this.userModel.findById(createOrder.user_id);

    if (!user) {
      throw new BadRequestException('User Not found');
    }
    const Product = await this.productModel.findById(createOrder.product_id);

    if (!Product) {
      throw new BadRequestException('Product Not found');
    }

    const newOrder = new this.orderModel(createOrder);
    return newOrder.save();
  }

  async UpdateOrdder(
    id: string,
    updateOrderData: CreateOrderDTO,
  ): Promise<Orders> {
    const updateOrder = await this.orderModel.findByIdAndUpdate(
      id,
      updateOrderData,
      { new: true },
    );

    if (!updateOrder) {
      throw new BadRequestException('order not found');
    }
    return updateOrder;
  }

  async searchOrders(search: string): Promise<Orders[]> {
    if (!search || !search.trim()) {
      return this.orderModel.find().exec();
    }

    const orConditions: Record<string, unknown>[] = [
      { product_name: { $regex: search, $options: 'i' } },
      { user_first_name: { $regex: search, $options: 'i' } },
      { user_last_name: { $regex: search, $options: 'i' } },
    ];

    const numericSearch = Number(search);
    if (!Number.isNaN(numericSearch)) {
      orConditions.push(
        { total_price: numericSearch },
        { product_quan: numericSearch },
      );
    }

    return this.orderModel.find({ $or: orConditions }).exec();
  }
}
