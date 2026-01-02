import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Products extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  about_product: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quan: number;

  @Prop({ required: false })
  is_fav: boolean;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
