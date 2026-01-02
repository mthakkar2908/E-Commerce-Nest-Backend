import { BadRequestException, Injectable } from '@nestjs/common';
import { Products } from './products.schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDTO } from './create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Products.name) private productModel: Model<Products>,
  ) {}

  async findAllProducts(): Promise<Products[]> {
    return this.productModel.find().exec();
  }

  async fineProductById(id: string): Promise<Products | null> {
    return this.productModel.findById(id).exec();
  }

  async CreateProduct(
    name: string,
    about_product: string,
    price: number,
    quan: number,
    is_fav: boolean | undefined,
  ): Promise<Products> {
    const newProduct = new this.productModel({
      name,
      about_product,
      price,
      quan,
      is_fav,
    });
    return newProduct.save();
  }

  async updateProduct(
    id: string,
    updateData: CreateProductDTO,
  ): Promise<Products> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedProduct) {
      throw new BadRequestException('Product not found');
    }
    return updatedProduct;
  }
  async searchProducts(search?: string): Promise<Products[]> {
    const query: FilterQuery<Products> = {};

    if (!search?.trim()) {
      return this.productModel.find().exec();
    }

    const orConditions: any[] = [];

    orConditions.push(
      { name: { $regex: search, $options: 'i' } },
      { about_product: { $regex: search, $options: 'i' } },
    );

    const numericSearch = Number(search);
    if (!Number.isNaN(numericSearch)) {
      orConditions.push({ price: numericSearch }, { quan: numericSearch });
    }

    query.$or = orConditions;

    return this.productModel.find(query).exec();
  }

  async toggleFavorite(productId: string) {
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('Invalid product id');
    }

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    product.is_fav = !product.is_fav;

    await product.save();

    return {
      message: 'Favorite status updated successfully',
      is_fav: product.is_fav,
    };
  }
}
