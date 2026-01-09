import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Contact extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  mobile_no: string;

  @Prop({ required: true })
  description: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
