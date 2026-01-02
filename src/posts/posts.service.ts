import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Post } from './post.schema';
import { User } from 'src/users/user.schema';
import type { File as MulterFile } from 'multer';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
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
  ): Promise<Post> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const imageUrl = image ? `/uploads/${image.filename}` : null;

    const newPost = new this.postModel({
      name,
      post_description,
      email,
      imageUrl,
      user: userId,
    });

    await newPost.save();
    return newPost.populate('user');
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

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const imageUrl = image ? `/uploads/${image.filename}` : null;

    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      { $set: { user: userId, name, post_description, email, imageUrl } },
      { new: true },
    );

    if (!updatedPost) {
      throw new BadRequestException('Post not found');
    }

    return updatedPost;
  }

  async getPosts() {
    return this.postModel.find().populate('user').exec();
  }
}
