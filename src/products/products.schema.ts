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

  @Prop({ required: true, default: 0 })
  order: number;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
