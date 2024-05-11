import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/database/schemas/user.schema';
import { JoinChatRoomDto } from './dtos/JoinChatRoomDto';
import { CreateChatRoomDto } from './dtos/CreateChatRoom.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  @Inject() private readonly chatService: ChatService;

  @Get(':id')
  async getChatMessages(@Param('id') id: string) {
    return this.chatService.getChatMessages(id);
  }

  @Post()
  async createChatRoom(
    @AuthUser() user: User,
    @Body() createChatRoomDto: CreateChatRoomDto,
  ) {
    return this.chatService.createChatRoom(createChatRoomDto, user);
  }

  @Post('join')
  async joinChat(
    @AuthUser() user: User,
    @Body() joinChatRoomDto: JoinChatRoomDto,
  ) {
    return this.chatService.joinChat(user, joinChatRoomDto);
  }

  @Post('leave/:name')
  async leaveFromChat(@AuthUser() user: User, @Param('name') name: string) {
    return this.chatService.leaveFromChat(user, name);
  }
}
