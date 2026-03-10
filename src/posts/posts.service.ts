/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Post } from './post.schema';
import { User } from 'src/users/user.schema';
import type { File as MulterFile } from 'multer';
import { Admin } from 'src/admin/admin.schema';
import { DashboardGateway } from 'src/gateway/dashboard.gateway';

interface PostUserResponse {
  _id: string;
  name: string;
  email: string;
  profile_image?: string;
}

export interface PostResponse {
  _id: string;
  name: string;
  post_description: string;
  email: string;
  imageUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user: PostUserResponse | null;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private dashboardGateway: DashboardGateway,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
  ): Promise<{
    data: PostResponse[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = (page - 1) * pageSize;

    const [posts, total] = await Promise.all([
      this.postModel
        .find()
        .populate('user', 'name email profile_image')
        .populate('admin', 'email')
        .lean()
        .skip(skip)
        .limit(pageSize)
        .exec(),

      this.postModel.countDocuments(),
    ]);

    const data = posts.map((post) => ({
      _id: post._id.toString(),
      name: post.name,
      post_description: post.post_description,
      email: post.email,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,

      user: post.user
        ? {
            _id: (post.user as any)._id.toString(),
            name: (post.user as any).name,
            email: (post.user as any).email,
            profile_image: (post.user as any).profile_image,
          }
        : post.admin
          ? {
              _id: (post.admin as any)._id.toString(),
              name: 'Admin',
              email: (post.admin as any).email,
            }
          : null,
    }));

    return {
      data,
      total,
      page,
      pageSize,
    };
  }
  async getTotalPosts(): Promise<number> {
    return this.postModel.find().countDocuments();
  }
  async getLastPosts() {
    return this.postModel.findOne().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async delete(postId: string): Promise<Post | null> {
    const post = await this.postModel?.findById(postId).exec();

    if (!post) {
      throw new BadRequestException('Post Not Found');
    }

    return this.postModel?.findByIdAndDelete(postId);
  }

  async create(
    userId: string,
    name: string,
    post_description: string,
    email: string,
    image?: MulterFile,
  ): Promise<PostResponse> {
    const user = await this.userModel.findById(userId);
    const adminUser = await this.adminModel.findById(userId);

    if (!user && !adminUser) {
      throw new BadRequestException('User not found');
    }

    const imageUrl = image ? `/uploads/${image.filename}` : null;

    const createdPost = await this.postModel.create({
      name,
      post_description,
      email,
      imageUrl,
      user: user ? userId : null,
      admin: adminUser ? userId : null,
    });

    const populatedPost = await this.postModel
      .findById(createdPost._id)
      .populate('user')
      .populate('admin')
      .lean()
      .exec();

    if (!populatedPost) {
      throw new BadRequestException('Post creation failed');
    }

    this.dashboardGateway.postAdded(createdPost);
    return {
      _id: populatedPost._id.toString(),
      name: populatedPost.name,
      post_description: populatedPost.post_description,
      email: populatedPost.email,
      imageUrl: populatedPost.imageUrl,
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt,

      user: populatedPost.user
        ? {
            _id: (populatedPost.user as any)._id.toString(),
            name: (populatedPost.user as any).name,
            email: (populatedPost.user as any).email,
            profile_image: (populatedPost.user as any).profile_image,
          }
        : populatedPost.admin
          ? {
              _id: (populatedPost.admin as any)._id.toString(),
              name: 'Admin',
              email: (populatedPost.admin as any).email,
            }
          : null,
    };
  }
  async update(
    id: string,
    userId: string,
    name: string,
    post_description: string,
    email: string,
    image?: MulterFile,
  ): Promise<Post> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postModel.findById(id);
    if (!post) {
      throw new BadRequestException('Post not found');
    }

    const updateData: any = {
      user: userId,
      name,
      post_description,
      email,
    };

    if (image) {
      updateData.imageUrl = `/uploads/${image.filename}`;
    } else {
      updateData.imageUrl = null;
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    return updatedPost!;
  }

  async getPosts() {
    return this.postModel.find().populate('user').exec();
  }
}
