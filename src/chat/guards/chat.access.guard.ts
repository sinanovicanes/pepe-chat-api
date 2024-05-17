import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChatAccessGuard implements CanActivate {
  @Inject() private readonly chatService: ChatService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;
    const roomName = req.params.roomName ?? req.body.roomName;

    if (!user || !roomName) return false;

    const chatRoom = await this.chatService.getChatRoomByName(roomName);

    if (!chatRoom) return false;

    return chatRoom.users.some((user) => user._id === user._id);
  }
}
