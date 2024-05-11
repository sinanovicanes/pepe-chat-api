import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/database/schemas/chat.schema';
import { User } from 'src/database/schemas/user.schema';
import { JoinChatRoomDto } from './dtos/JoinChatRoomDto';
import { CreateChatRoomDto } from './dtos/CreateChatRoom.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  @InjectModel(Chat.name) private readonly chatModel: Model<Chat>;
  @Inject() private readonly userService: UserService;

  async getChatMessages(name: Chat['name']) {
    return await this.chatModel.find({ name }).populate('ChatMessages').exec();
  }

  async getChatRoomByName(name: Chat['name']) {
    return await this.chatModel.findOne({ name }).exec();
  }

  async createChatRoom(createChatRoomDto: CreateChatRoomDto, owner?: User) {
    const newChatRoom = new this.chatModel({
      ...createChatRoomDto,
      owner,
      users: [owner],
    });

    try {
      const savedRoom = await newChatRoom.save();

      if (owner) {
        await this.userService.addChatToUser(owner, savedRoom._id);
      }

      return savedRoom;

      // TODO: ADD ROOM TO THE USER
    } catch {
      throw new HttpException(
        'This room is already exist',
        HttpStatus.CONFLICT,
      );
    }
  }

  async joinChat(user: User, joinChatRoomDto: JoinChatRoomDto) {
    const chatRoom = await this.getChatRoomByName(joinChatRoomDto.roomName);

    if (!chatRoom)
      throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);

    chatRoom.users.push(user);

    return await chatRoom.save();
  }

  async leaveFromChat(user: User, chatName: Chat['name']) {
    const chatRoom = await this.getChatRoomByName(chatName);

    if (!chatRoom)
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

    try {
      const result = await this.chatModel
        .updateOne(
          { id: chatRoom._id },
          {
            $pullAll: {
              users: [{ id: user._id }],
            },
          },
        )
        .exec();

      console.log(result.acknowledged);

      if (!result.acknowledged)
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

      this.userService.removeChatFromUser(user, chatRoom._id);

      return { ok: true };
    } catch {
      throw new HttpException('Failed', HttpStatus.CONFLICT);
    }
  }
}
