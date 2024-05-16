import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Chat } from 'src/database/schemas/chat.schema';
import { User } from 'src/database/schemas/user.schema';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from 'src/database/schemas/chat.message.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InternalEvents } from 'src/enums/internal.events';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  @InjectModel(ChatMessage.name)
  private readonly chatMessageModel: Model<ChatMessage>;
  @Inject() private readonly chatService: ChatService;
  @Inject() private readonly eventEmitter: EventEmitter2;

  async createMessage(
    roomName: Chat['name'],
    user: User,
    createMessageDto: CreateMessageDto,
  ) {
    const chatRoom = await this.chatService.getChatRoomByName(roomName);

    if (!chatRoom)
      throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);

    const message = new this.chatMessageModel({
      ...createMessageDto,
      user,
      chatRoom,
    });

    try {
      const createdMessage = await message.save();

      chatRoom.messages.push(createdMessage);
      await chatRoom.save();

      this.eventEmitter.emit(InternalEvents.MESSAGE_CREATED, {
        user,
        createdMessage,
        roomName,
      });

      return createdMessage;
    } catch {
      throw new HttpException(
        'Failed to create a message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
