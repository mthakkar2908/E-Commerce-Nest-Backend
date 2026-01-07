import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailSignup extends Document {
  @Prop({ required: true })
  email: string;
}

export const SignupSchema = SchemaFactory.createForClass(EmailSignup);
