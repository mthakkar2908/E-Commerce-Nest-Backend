/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Multer } from 'multer';
import { Category } from './category.schema';
import { CategoryDTO, UpdateCategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async getCategories(
    page: number,
    pageSize: number,
  ): Promise<{
    data: Category[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = (page - 1) * pageSize;
    const [categories, total] = await Promise.all([
      this.categoryModel
        .find()
        .sort({ order: 1 })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.categoryModel.countDocuments(),
    ]);

    return {
      data: categories,
      total,
      page,
      pageSize,
    };
  }

  async getTotalCategories(): Promise<number> {
    return this.categoryModel.find().countDocuments();
  }

  async getLastCategories() {
    return this.categoryModel.findOne().sort({ createdAt: -1 }).exec();
  }
  async create(categoryDTO: CategoryDTO, image?: Multer.File) {
    const { name, description, isActive } = categoryDTO;
    const existingCategory = await this.categoryModel.findOne({ name });
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    const imageUrl = image ? `/uploads/category/${image.filename}` : '';

    const newCategory = await this.categoryModel.create({
      name,
      description,
      isActive,
      image: imageUrl,
    });

    return newCategory;
  }

  async update(categoryDTO: UpdateCategoryDTO, image?: Multer.File) {
    const { id, name, description, isActive } = categoryDTO;
    if (!id) {
      throw new BadRequestException('Id is required to perfrom this action');
    }

    const isExist = await this.categoryModel.findById(id);

    if (!isExist) {
      throw new NotFoundException('Category not found');
    }

    const updateData: any = {
      name,
      description,
      isActive,
    };

    if (image) {
      updateData.image = `/uploads/category/${image.filename}`;
    } else {
      updateData.image = null;
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    return updatedCategory!;
  }

  async deleteCategory(id: string) {
    if (!id && !isValidObjectId(id)) {
      throw new BadRequestException('Valid Id is required.');
    }
    const deleteCategory = await this.categoryModel.findByIdAndDelete(id);

    return {
      message: 'Category Deleted Successfully',
      deleteCategory,
    };
  }
}
