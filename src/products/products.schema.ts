import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Products extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  about_product!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  quan!: number;

  @Prop({ required: false })
  is_fav!: boolean;

  @Prop({ required: true, default: 0 })
  order?: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category_id!: mongoose.Schema.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
