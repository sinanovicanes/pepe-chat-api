import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guards/jwt.auth.guard';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  @Inject() private readonly chatService: ChatService;

  @Get(':id')
  async getChatMessages(@Param('id') id: string) {
    return this.chatService.getChatMessages(id);
  }
}
