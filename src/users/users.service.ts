/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import type { File as MulterFile } from 'multer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async create(
    name: string | undefined,
    email: string,
    password: string,
  ): Promise<User> {
    const newUser = new this.userModel({ name, email, password });
    return newUser.save();
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ token: string; name: string; userId: string; image: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    user.token = token;
    await user.save();

    return {
      token,
      name: user.name,
      userId: user._id.toString(),
      image: user?.profile_image,
    };
  }

  async updateProfile(
    userId: string,
    name: string,
    email: string,
    image?: MulterFile,
  ): Promise<{ message: string; user: any }> {
    try {
      if (!userId || !name || !email) {
        throw new BadRequestException('Missing required fields');
      }

      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const imageUrl = image ? `/uploads/profile/${image.filename}` : '';

      user.name = name;
      user.email = email;
      if (imageUrl) {
        user.profile_image = imageUrl;
      }

      const updatedUser = await user.save();

      return {
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.profile_image,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error?.code === 11000) {
        throw new BadRequestException('Email already exists');
      }

      throw new BadRequestException('Failed to update profile');
    }
  }
}
