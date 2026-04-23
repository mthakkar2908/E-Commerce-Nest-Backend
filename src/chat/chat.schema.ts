import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  declare _id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true })
  senderId!: Types.ObjectId;

  @Prop({ required: true })
  senderName!: string;

  @Prop({ type: Types.ObjectId, required: true })
  recipientId!: Types.ObjectId;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: false })
  isRead!: boolean;

  @Prop({ default: new Date() })
  createdAt!: Date;

  @Prop({ default: new Date() })
  updatedAt!: Date;

  @Prop({
    type: Map,
    of: [String],
    default: {},
  })
  reactions?: Map<string, string[]>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
