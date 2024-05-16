import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModelDefinition } from 'src/database/schemas/chat.schema';
import { ChatMessageModelDefinition } from 'src/database/schemas/chat.message.schema';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    ChatModule,
    MongooseModule.forFeature([
      ChatModelDefinition,
      ChatMessageModelDefinition,
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
