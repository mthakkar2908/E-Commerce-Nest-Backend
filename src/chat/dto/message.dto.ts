import { IsString, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsMongoId()
  senderId: Types.ObjectId;

  @IsString()
  senderName: string;

  @IsMongoId()
  recipientId: Types.ObjectId;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  socketId?: string;
}

export class MessageResponseDto {
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}
