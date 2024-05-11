import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModelDefinition } from 'src/database/schemas/chat.schema';
import { ChatMessageModelDefinition } from 'src/database/schemas/chat.message.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      ChatModelDefinition,
      ChatMessageModelDefinition,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
