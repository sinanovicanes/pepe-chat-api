import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dtos/SignUpDto';
import { User } from 'src/database/schemas/user.schema';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { Chat } from 'src/database/schemas/chat.schema';

@Injectable()
export class UserService {
  @InjectModel(User.name) private readonly userModel: Model<User>;

  async findUserByUsername(username: User['username']) {
    return this.userModel.findOne({ username }).exec();
  }

  async findUserById(userId: User['_id']) {
    return this.userModel.findById(userId).exec();
  }

  async createUser(createUserDto: SignUpDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    try {
      return await createdUser.save();
    } catch {
      throw new HttpException(
        'This username or email address is already being used',
        HttpStatus.CONFLICT,
      );
    }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    return this.userModel
      .updateOne(
        {
          _id: user._id,
        },
        updateUserDto,
      )
      .exec();
  }

  async getUserChatList(user: User) {
    const userWithChatRooms = await this.userModel
      .findById(user._id)
      .populate('chats')
      .exec();

    return userWithChatRooms.chats;
  }

  async addChatToUser(user: User, chatId: Chat['_id']) {
    const result = await this.userModel.updateOne(
      { _id: user._id },
      {
        $push: {
          chats: chatId,
        },
      },
    );

    return result.acknowledged;
  }

  async removeChatFromUser(user: User, chatId: Chat['_id']) {
    const result = await this.userModel.updateOne(
      { _id: user._id },
      {
        $pullAll: {
          chats: [{ _id: chatId }],
        },
      },
    );

    return result.acknowledged;
  }
}
