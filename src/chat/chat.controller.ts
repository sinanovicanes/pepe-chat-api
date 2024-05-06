import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  @Inject() private readonly chatService: ChatService;

  @Get(':id')
  async getChatMessages(@Param('id') id: string) {
    return this.chatService.getChatMessages(id);
  }
}
