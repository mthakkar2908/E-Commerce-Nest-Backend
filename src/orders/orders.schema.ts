import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Orders extends Document {
  @Prop({ required: true, ref: 'Products' })
  product_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  user_first_name: string;

  @Prop({ required: true })
  user_last_name: string;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  mobile_no: number;

  @Prop({ required: true })
  total_price: number;

  @Prop({ required: true })
  product_quan: number;
}

export const OrderSchema = SchemaFactory.createForClass(Orders);
