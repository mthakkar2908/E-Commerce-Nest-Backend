/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './chat.schema';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async saveMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async getConversation(
    userId1: string,
    userId2: string,
    limit: number = 50,
  ): Promise<Message[]> {
    const id1 = new Types.ObjectId(userId1);
    const id2 = new Types.ObjectId(userId2);

    return this.messageModel
      .find({
        $or: [
          { senderId: id1, recipientId: id2 },
          { senderId: id2, recipientId: id1 },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async markAsRead(messageIds: string[]): Promise<void> {
    await this.messageModel.updateMany(
      { _id: { $in: messageIds } },
      { isRead: true },
    );
  }

  /**
   * Add reaction to message
   */
  async addReaction(
    messageId: string,
    emoji: string,
    userId: string,
  ): Promise<Message | null> {
    const message = await this.messageModel.findById(messageId);
    if (!message) return null;

    if (!message.reactions) {
      message.reactions = new Map();
    }

    const reactionsMap = message.reactions as any;
    if (!reactionsMap[emoji]) {
      reactionsMap[emoji] = [];
    }

    // Avoid duplicate reactions from same user
    if (!reactionsMap[emoji].includes(userId)) {
      reactionsMap[emoji].push(userId);
    }

    message.reactions = reactionsMap;
    return message.save();
  }

  /**
   * Remove reaction from message
   */
  async removeReaction(
    messageId: string,
    emoji: string,
    userId: string,
  ): Promise<Message | null> {
    const message = await this.messageModel.findById(messageId);
    if (!message) return null;

    const reactionsMap = (message.reactions || {}) as any;
    if (reactionsMap[emoji]) {
      reactionsMap[emoji] = reactionsMap[emoji].filter(
        (id: string) => id !== userId,
      );

      if (reactionsMap[emoji].length === 0) {
        delete reactionsMap[emoji];
      }

      message.reactions = reactionsMap;
      return message.save();
    }

    return message;
  }

  async markMessagesAsRead(chatId: string, readerId: string) {
    await this.messageModel.updateMany(
      {
        chatId,
        senderId: { $ne: readerId },
        isRead: false,
      },
      { $set: { isRead: true } },
    );
  }

  async getUnreadMessages(userId: string): Promise<number> {
    const id = new Types.ObjectId(userId);
    return this.messageModel.countDocuments({
      recipientId: id,
      isRead: false,
    });
  }
}
