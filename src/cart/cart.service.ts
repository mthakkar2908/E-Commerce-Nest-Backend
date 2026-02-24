import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model, Types } from 'mongoose';
import { AddMultiplsCarts, AddQuantityDTO } from './create-cart.dto';
import { Products } from 'src/products/products.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Products.name) private productModel: Model<Products>,
  ) {}

  async getCart() {
    return this.cartModel.find();
  }

  async getCartById(userId: string) {
    return this.cartModel.findById(userId);
  }
  async addToCart(userId: string, dto: AddMultiplsCarts) {
    const productPromises = dto.items.map((item) =>
      this.productModel.findById(item.productId),
    );

    const products = await Promise.all(productPromises);

    if (products.some((p) => !p)) {
      throw new NotFoundException('One or more products not found');
    }

    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = new this.cartModel({ userId, items: [] });
    }

    for (const item of dto.items) {
      const updatedProduct = await this.productModel.findOneAndUpdate(
        {
          _id: item.productId,
          quan: { $gte: item.quantity },
        },
        {
          $inc: { quan: -item.quantity },
        },
        { new: true },
      );

      if (!updatedProduct) {
        throw new BadRequestException(`Not enough stock available`);
      }

      const index = cart.items.findIndex(
        (i) => i.productId.toString() === item.productId,
      );

      if (index > -1) {
        cart.items[index].quantity += item.quantity;
      } else {
        cart.items.push({
          productId: new Types.ObjectId(item.productId),
          quantity: item.quantity,
        });
      }
    }

    return cart.save();
  }

  async addQuantity(dto: AddQuantityDTO) {
    const cart = await this.cartModel.findById(dto.cartId);

    if (!cart) {
      throw new NotFoundException('Cart Not found.');
    }

    const product = await this.productModel.findById(dto.productId);

    if (!product) {
      throw new NotFoundException('Product Not found.');
    }

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === dto.productId,
    );

    if (!cartItem) {
      throw new NotFoundException('This product is not in your cart.');
    }

    if (product.quan < dto.quantity) {
      throw new BadRequestException(
        `You are trying to add ${dto.quantity}, but only ${product.quan} available in stock.`,
      );
    }

    const newQuantity = cartItem.quantity + dto.quantity;
    if (product.quan < newQuantity) {
      throw new BadRequestException(
        `Cannot add ${dto.quantity} to your current ${cartItem.quantity}. Only ${product.quan} available in stock.`,
      );
    }

    cartItem.quantity = newQuantity;

    await cart.save();

    return cart;
  }
}
