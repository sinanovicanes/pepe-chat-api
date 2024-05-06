import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/database/schemas/chat.schema';

@Injectable()
export class ChatService {
  @InjectModel(Chat.name) private readonly chatModel: Model<Chat>;

  async getChatMessages(name: string) {
    return await this.chatModel.find({ name }).populate('ChatMessages').exec();
  }
}
