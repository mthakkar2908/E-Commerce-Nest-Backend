import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

@Schema()
export class EmailSignup extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: User | Types.ObjectId;

  @Prop({ required: false })
  email: string;
}

export const SignupSchema = SchemaFactory.createForClass(EmailSignup);
