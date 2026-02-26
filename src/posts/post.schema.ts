import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  post_description: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
