import { ChatMessage } from 'src/database/schemas/chat.message.schema';
import { Chat } from 'src/database/schemas/chat.schema';
import { User } from 'src/database/schemas/user.schema';

export class MessageCreatedEvent {
  constructor(
    public user: User,
    public message: ChatMessage,
    public roomName: Chat['name'],
  ) {}
}
