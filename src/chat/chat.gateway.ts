/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Injectable } from '@nestjs/common';

interface UserSocketMap {
  [userId: string]: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private userSocketMap: UserSocketMap = {};
  private socketUserMap: { [socketId: string]: string } = {};

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('User connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUserMap[client.id];
    if (userId) {
      delete this.userSocketMap[userId];
      delete this.socketUserMap[client.id];
      console.log('User disconnected:', userId, 'Socket:', client.id);
    }
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @MessageBody() data: { userId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, userName } = data;
    this.userSocketMap[userId] = client.id;
    this.socketUserMap[client.id] = userId;

    console.log('User registered:', userId, 'Socket:', client.id);
    this.server.emit('userOnline', {
      userId,
      userName,
      socketId: client.id,
    });
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      senderName: string;
      recipientId: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { senderId, senderName, recipientId, message } = data;

    const savedMsg = await this.chatService.saveMessage({
      senderId: senderId as any,
      senderName,
      recipientId: recipientId as any,
      message,
      socketId: client.id,
    });

    const recipientSocketId = this.userSocketMap[recipientId];

    const messageData = {
      senderId,
      senderName,
      message,
      createdAt: new Date(),
      socketId: client.id,
      _id: savedMsg._id,
      isRead: false,
    };

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveMessage', messageData);
    }

    client.emit('receiveMessage', {
      ...messageData,
      recipientId,
    });
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @MessageBody() data: { userId1: string; userId2: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId1, userId2 } = data;
    const messages = await this.chatService.getConversation(
      userId1,
      userId2,
      50,
    );

    client.emit('messageHistory', {
      messages: messages.map((msg) => ({
        senderId: msg.senderId.toString(),
        senderName: msg.senderName,
        recipientId: msg.recipientId.toString(),
        message: msg.message,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
        _id: msg._id.toString(),
        reactions: msg.reactions
          ? Object.fromEntries(msg.reactions)
          : undefined,
      })),
    });
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUsers = Object.keys(this.userSocketMap);
    client.emit('onlineUsers', { users: onlineUsers });
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { messageIds: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatService.markAsRead(data.messageIds);
  }

  @SubscribeMessage('addReaction')
  async handleAddReaction(
    @MessageBody()
    data: {
      messageId: string;
      emoji: string;
      senderId: string;
      recipientId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId, emoji, senderId, recipientId } = data;

    const updatedMessage = await this.chatService.addReaction(
      messageId,
      emoji,
      senderId,
    );

    if (updatedMessage) {
      const recipientSocketId = this.userSocketMap[recipientId];
      const reactionsMap = updatedMessage.reactions
        ? Object.fromEntries(updatedMessage.reactions)
        : {};

      const reactionData = {
        messageId: updatedMessage._id,
        emoji,
        reactions: reactionsMap,
      };

      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('reactionUpdated', reactionData);
      }

      client.emit('reactionUpdated', reactionData);
    }
  }

  /**
   * Remove reaction from message
   */
  @SubscribeMessage('removeReaction')
  async handleRemoveReaction(
    @MessageBody()
    data: {
      messageId: string;
      emoji: string;
      senderId: string;
      recipientId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId, emoji, senderId, recipientId } = data;

    const updatedMessage = await this.chatService.removeReaction(
      messageId,
      emoji,
      senderId,
    );

    if (updatedMessage) {
      const recipientSocketId = this.userSocketMap[recipientId];
      const reactionsMap = updatedMessage.reactions
        ? Object.fromEntries(updatedMessage.reactions)
        : {};

      const reactionData = {
        messageId: updatedMessage._id,
        emoji,
        reactions: reactionsMap,
      };

      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit('reactionUpdated', reactionData);
      }

      client.emit('reactionUpdated', reactionData);
    }
  }

  /**
   * Send file
   */
  @SubscribeMessage('sendFile')
  async handleFileUpload(
    @MessageBody()
    data: {
      senderId: string;
      senderName: string;
      recipientId: string;
      fileName: string;
      fileType: string;
      fileData: string;
      fileSize: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const {
      senderId,
      senderName,
      recipientId,
      fileName,
      fileType,
      fileData,
      fileSize,
    } = data;

    const fileMessage = await this.chatService.saveMessage({
      senderId: senderId as any,
      senderName,
      recipientId: recipientId as any,
      message: `📎 ${fileName}`,
      socketId: client.id,
    });

    const messageData = {
      senderId,
      senderName,
      message: `📎 ${fileName}`,
      fileName,
      fileType,
      fileData,
      fileSize,
      createdAt: new Date(),
      _id: fileMessage._id,
      socketId: client.id,
    };

    const recipientSocketId = this.userSocketMap[recipientId];
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveFile', messageData);
    }

    client.emit('receiveFile', messageData);
  }

  /**
   * Typing indicator
   */
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { recipientId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const { recipientId, isTyping } = data;
    const recipientSocketId = this.userSocketMap[recipientId];

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('userTyping', { isTyping });
    }
  }
}
