import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailSignup extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  email: string;
}

export const SignupSchema = SchemaFactory.createForClass(EmailSignup);
