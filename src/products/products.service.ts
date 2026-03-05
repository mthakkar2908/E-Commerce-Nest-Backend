import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Products } from './products.schema';
import { FilterQuery, isValidObjectId, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDTO } from './create-product.dto';
import { Category } from 'src/category/category.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Products.name) private productModel: Model<Products>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAllProducts(
    page: number,
    pageSize: number,
  ): Promise<{
    data: Products[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = (page - 1) * pageSize;

    const [products, total] = await Promise.all([
      this.productModel
        .find()
        .sort({ order: 1 })
        .skip(skip)
        .limit(pageSize)
        .populate('category_id', 'name')
        .exec(),
      this.productModel.countDocuments(),
    ]);

    return {
      data: products,
      total,
      page,
      pageSize,
    };
  }

  async getTotalProducts(): Promise<number> {
    return this.productModel.find().countDocuments();
  }
  async fineProductById(id: string): Promise<Products | null> {
    return this.productModel.findById(id).exec();
  }
  async findProductByCategoryId(cat_id: string): Promise<Products[]> {
    return this.productModel
      .find({ category_id: new Types.ObjectId(cat_id) })
      .populate('category_id', 'name')
      .exec();
  }
  async getLastProduct() {
    return this.productModel.findOne().sort({ createdAt: -1 }).exec();
  }

  async deleteProduct(
    id: string,
  ): Promise<{ message: string; deleteProduct: Products | null }> {
    if (!id) {
      throw new BadRequestException('Id is required to perform this action');
    }

    const deleteProduct = await this.productModel.findByIdAndDelete(id).exec();

    return {
      message: 'Product Deleted',
      deleteProduct,
    };
  }
  async CreateProduct(
    name: string,
    about_product: string,
    price: number,
    quan: number,
    is_fav: boolean | undefined,
    category_id: string,
  ): Promise<Products> {
    const newProduct = new this.productModel({
      name,
      about_product,
      price,
      quan,
      is_fav,
      category_id,
    });

    const findCategory = await this.categoryModel.findById(category_id);

    if (!findCategory) {
      throw new NotFoundException('Category Not found');
    }

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
      return this.productModel.find().populate('category_id', 'name').exec();
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

    return this.productModel.find(query).populate('category_id', 'name').exec();
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

  async addProductQuan(productId: string, quantity: number) {
    if (!productId) {
      throw new BadRequestException('Product ID required.');
    }

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (!quantity) {
      throw new BadRequestException('Quantity is required');
    }

    product.quan += quantity;
    await product.save();

    return {
      message: 'Quantity Added!',
    };
  }
}
