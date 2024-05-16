import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChatGuard implements CanActivate {
  @Inject() private readonly chatService: ChatService;

  async canActivate(context: ExecutionContext): Promise<any> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;
    const roomName = req.params.roomName;

    if (!user || !roomName) return;

    const chatRoom = await this.chatService.getChatRoomByName(roomName);

    if (!chatRoom) return false;

    return chatRoom.users.find((user) => user._id === user._id);
  }
}
