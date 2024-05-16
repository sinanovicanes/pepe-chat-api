import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { AuthUser } from 'src/utils/decorators';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/auth/guards/jwt.auth.guard';
import { ChatGuard } from './guars/chat.guard';

@UseGuards(JwtGuard)
@Controller('message')
export class MessageController {
  @Inject() private readonly messageService: MessageService;

  @UseGuards(ChatGuard)
  @Get('/:roomName')
  async getChatMessages(@Param('roomName') roomName: string) {
    return this.messageService.getChatMessages(roomName);
  }

  @Post('/:roomName')
  async createMessage(
    @AuthUser() user: User,
    @Param('roomName') roomName: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.messageService.createMessage(
      roomName,
      user,
      createMessageDto,
    );

    return message;
  }
}
