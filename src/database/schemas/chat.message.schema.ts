import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Chat } from './chat.schema';
import { User } from './user.schema';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema()
export class ChatMessage {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user' })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'chat' })
  chatRoom: Chat;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
export const ChatMessageModelDefinition: ModelDefinition = {
  name: ChatMessage.name,
  schema: ChatMessageSchema,
};
