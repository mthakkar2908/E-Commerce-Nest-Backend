import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TermsConditions extends Document {
  @Prop({ required: true })
  TermsConditionsText: string;
}

export const TermsConditionsSchema =
  SchemaFactory.createForClass(TermsConditions);
